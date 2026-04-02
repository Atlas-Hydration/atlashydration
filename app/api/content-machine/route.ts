import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a premium health content strategist for Atlas Hydration, a zero-sugar electrolyte brand founded by a commercial airline pilot. Generate TikTok slideshow content that is educational, credible, and subtly tied to hydration and electrolytes. Tone: clean, confident, Apple-like — no emojis, no hype language, no exclamation marks. Think: what a knowledgeable friend would tell you, not an ad.`;

function buildUserPrompt(topics: string[], count: number): string {
  const picked = topics.sort(() => Math.random() - 0.5).slice(0, count);
  return `Generate ${count} TikTok slideshow decks. Each deck has 8 slides.

For each deck return:
- topic: a hook-driven title (4-10 words)
- slides: array of 8 objects with slide_number (1-8), headline (4-7 words max, punchy), body (1-2 sentences max, factual, no fluff), type ("hook" for slide 1, "content" for slides 2-7, "cta" for slide 8)

Slide 8 (CTA) always: headline = "Stay Hydrated. Stay Sharp.", body = "Atlas Hydration — Zero Sugar Electrolytes. atlashydration.com"

Topic categories to draw from: ${picked.join(", ")}

Return ONLY a valid JSON array of ${count} deck objects. No markdown, no explanation.`;
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn("ANTHROPIC_API_KEY is not set in environment variables");
    return NextResponse.json(
      { error: "Anthropic API key is not configured on the server" },
      { status: 500 }
    );
  }

  let body: { topics?: string[]; count?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const topics = body.topics ?? [
    "sleep optimization", "morning routines", "dehydration symptoms",
    "pilot and aviation health", "athletic recovery", "cognitive performance",
    "gut health", "circadian rhythm", "travel health", "electrolyte science",
  ];
  const count = body.count ?? 5;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildUserPrompt(topics, count) }],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Anthropic API error:", res.status, errText);
      return NextResponse.json(
        { error: `Anthropic API error: ${res.status}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    const text = data.content?.[0]?.text || "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    const decks = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ decks });
  } catch (e) {
    console.error("Content generation error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Generation failed" },
      { status: 500 }
    );
  }
}
