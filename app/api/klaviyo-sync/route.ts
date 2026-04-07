import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const API_BASE = "https://a.klaviyo.com/api";
const API_REVISION = "2024-10-15";

const EMAIL_MAP = [
  { file: "welcome/email-01-welcome.html", name: "Atlas Welcome 01 — Welcome to Atlas" },
  { file: "welcome/email-02-origin-story.html", name: "Atlas Welcome 02 — Why a Pilot Built an Electrolyte Brand" },
  { file: "welcome/email-03-sugar-comparison.html", name: "Atlas Welcome 03 — 11g Sugar the Healthy Option" },
  { file: "welcome/email-04-social-proof.html", name: "Atlas Welcome 04 — Do Not Take Our Word For It" },
  { file: "welcome/email-05-urgency-discount.html", name: "Atlas Welcome 05 — Your 10 Percent Off Expires" },
  { file: "abandoned-cart/email-06-cart-reminder.html", name: "Atlas Cart 01 — You Left Something Behind" },
  { file: "abandoned-cart/email-07-social-proof-cart.html", name: "Atlas Cart 02 — Here Is Why They Come Back" },
  { file: "abandoned-cart/email-08-final-cart.html", name: "Atlas Cart 03 — Last Chance" },
  { file: "post-purchase/email-09-order-confirmation.html", name: "Atlas PostPurchase 01 — Your Atlas Is On The Way" },
  { file: "post-purchase/email-10-usage-guide.html", name: "Atlas PostPurchase 02 — Get The Most Out Of Your Atlas" },
  { file: "post-purchase/email-11-review-request.html", name: "Atlas PostPurchase 03 — How Are You Liking Atlas" },
  { file: "winback/email-12-miss-you.html", name: "Atlas Winback 01 — We Miss You" },
  { file: "winback/email-13-whats-new.html", name: "Atlas Winback 02 — Here Is What You Have Been Missing" },
  { file: "winback/email-14-final-offer.html", name: "Atlas Winback 03 — Your Exclusive 15 Percent Off" },
];

function headers(apiKey: string) {
  return {
    Authorization: `Klaviyo-API-Key ${apiKey}`,
    "Content-Type": "application/vnd.api+json",
    Accept: "application/vnd.api+json",
    revision: API_REVISION,
  };
}

export async function POST(request: Request) {
  let body: { apiKey?: string; emailIndex?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const apiKey = body.apiKey || process.env.KLAVIYO_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "No Klaviyo API key provided" }, { status: 400 });
  }

  // If emailIndex is provided, sync just that one email
  const emailsToSync = typeof body.emailIndex === "number"
    ? [EMAIL_MAP[body.emailIndex]].filter(Boolean)
    : EMAIL_MAP;

  const results: Array<{ name: string; status: string; id?: string; error?: string }> = [];

  for (const entry of emailsToSync) {
    const filePath = join(process.cwd(), "src", "emails", entry.file);

    let html: string;
    if (existsSync(filePath)) {
      html = readFileSync(filePath, "utf-8");
    } else {
      results.push({ name: entry.name, status: "missing" });
      continue;
    }

    try {
      // Check if template exists
      const checkRes = await fetch(
        `${API_BASE}/templates?filter=equals(name,"${encodeURIComponent(entry.name)}")`,
        { headers: headers(apiKey) }
      );
      const checkJson = await checkRes.json();
      const existing = checkJson?.data?.[0];

      let templateId: string;

      if (existing) {
        // Update existing
        const res = await fetch(`${API_BASE}/templates/${existing.id}`, {
          method: "PATCH",
          headers: headers(apiKey),
          body: JSON.stringify({
            data: { type: "template", id: existing.id, attributes: { name: entry.name, html } },
          }),
        });
        if (!res.ok) throw new Error(`Update failed: ${res.status}`);
        const json = await res.json();
        templateId = json?.data?.id || existing.id;
        results.push({ name: entry.name, status: "updated", id: templateId });
      } else {
        // Create new
        const res = await fetch(`${API_BASE}/templates`, {
          method: "POST",
          headers: headers(apiKey),
          body: JSON.stringify({
            data: { type: "template", attributes: { name: entry.name, editor_type: "CODE", html } },
          }),
        });
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Create failed: ${res.status} ${errText.slice(0, 100)}`);
        }
        const json = await res.json();
        templateId = json?.data?.id || "";
        results.push({ name: entry.name, status: "created", id: templateId });
      }

      // Rate limit
      await new Promise((r) => setTimeout(r, 500));
    } catch (e) {
      results.push({ name: entry.name, status: "failed", error: e instanceof Error ? e.message : String(e) });
    }
  }

  return NextResponse.json({ results });
}
