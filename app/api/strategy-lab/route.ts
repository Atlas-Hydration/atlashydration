import { NextResponse } from "next/server";

const MODEL_PRIORITY = [
  "claude-sonnet-4-20250514",
  "claude-3-5-sonnet-20241022",
  "claude-3-haiku-20240307",
];

async function callAnthropic(apiKey: string, model: string, system: string, user: string) {
  return fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured on the server" },
      { status: 500 }
    );
  }

  let body: { system: string; prompt: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.system || !body.prompt) {
    return NextResponse.json({ error: "Missing system or prompt" }, { status: 400 });
  }

  const errors: string[] = [];

  for (const model of MODEL_PRIORITY) {
    try {
      const res = await callAnthropic(apiKey, model, body.system, body.prompt);
      if (!res.ok) {
        const errText = await res.text();
        errors.push(`${model}: ${res.status} ${errText.slice(0, 100)}`);
        continue;
      }
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      return NextResponse.json({ result: text, model });
    } catch (e) {
      errors.push(`${model}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return NextResponse.json(
    { error: `All models failed. ${errors.join(" | ")}` },
    { status: 502 }
  );
}
