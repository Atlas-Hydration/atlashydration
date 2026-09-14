import { NextResponse } from "next/server";

const LIST_ID = "XDwcHp"; // Atlas Hydration Email List

// ---------------------------------------------------------------------------
// Best-effort per-IP rate limit. This is a single-instance in-memory guard
// (not shared across serverless instances/regions), but it's enough to stop
// a simple scripted spammer from hammering this endpoint — real distributed
// abuse would need a shared store (e.g. Upstash), not worth the added infra
// for an email-capture form.
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 5; // max submissions per IP per window
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);

  // Prevent unbounded growth on a long-lived instance.
  if (requestLog.size > 5000) {
    for (const [key, times] of requestLog) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) requestLog.delete(key);
    }
  }

  return timestamps.length > RATE_LIMIT_MAX;
}

export async function POST(request: Request) {
  const apiKey = process.env.KLAVIYO_API_KEY;
  if (!apiKey) {
    console.error("[Klaviyo] Missing KLAVIYO_API_KEY env var");
    return NextResponse.json({ error: "Server config error" }, { status: 500 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: { email?: string; source?: string; properties?: Record<string, string>; hp?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: a real visitor never fills this hidden field. Pretend success
  // so the bot doesn't learn it was caught, without ever calling Klaviyo.
  if (body.hp && body.hp.trim()) {
    return NextResponse.json({ success: true });
  }

  const email = body.email?.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const source = body.source || "Website";
  const properties = body.properties || {};

  try {
    // Klaviyo Subscribe Profiles endpoint (server-side, uses private key)
    // https://developers.klaviyo.com/en/reference/subscribe_profiles
    const res = await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/", {
      method: "POST",
      headers: {
        Authorization: `Klaviyo-API-Key ${apiKey}`,
        "Content-Type": "application/vnd.api+json",
        Accept: "application/vnd.api+json",
        revision: "2024-10-15",
      },
      body: JSON.stringify({
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            custom_source: source,
            profiles: {
              data: [
                {
                  type: "profile",
                  attributes: {
                    email,
                    properties: {
                      "Signup Source": source,
                      ...properties,
                    },
                    subscriptions: {
                      email: {
                        marketing: {
                          consent: "SUBSCRIBED",
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
          relationships: {
            list: {
              data: { type: "list", id: LIST_ID },
            },
          },
        },
      }),
    });

    if (res.ok || res.status === 202) {
      console.log(`[Klaviyo] ✓ Subscribed ${email} via "${source}"`);
      return NextResponse.json({ success: true });
    }

    const errText = await res.text().catch(() => "");
    console.error(`[Klaviyo] ✗ Subscribe failed (${res.status}):`, errText.slice(0, 300));
    return NextResponse.json(
      { error: `Klaviyo error ${res.status}`, details: errText.slice(0, 200) },
      { status: 502 }
    );
  } catch (err) {
    console.error("[Klaviyo] Subscribe exception:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
