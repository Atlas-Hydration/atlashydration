import { NextResponse } from "next/server";

const LIST_ID = "XDwcHp"; // Atlas Hydration "Email List"
const COMPANY_ID = "XLatdi"; // Klaviyo public site ID (safe to expose; not a secret)
const REVISION = "2024-10-15";
// Overridable so the integration can be exercised against a local mock.
const KLAVIYO_BASE = process.env.KLAVIYO_API_BASE || "https://a.klaviyo.com";

// ---------------------------------------------------------------------------
// Best-effort per-IP rate limit. This is a single-instance in-memory guard
// (not shared across serverless instances/regions), but it's enough to stop
// a simple scripted spammer from hammering this endpoint.
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 8; // max submissions per IP per window
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);

  if (requestLog.size > 5000) {
    for (const [key, times] of requestLog) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) requestLog.delete(key);
    }
  }

  return timestamps.length > RATE_LIMIT_MAX;
}

interface Stage {
  stage: string;
  status: number | "network_error" | "skipped";
}

async function klaviyoRequest(path: string, headers: Record<string, string>, payload: unknown) {
  const res = await fetch(`${KLAVIYO_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/vnd.api+json",
      Accept: "application/vnd.api+json",
      revision: REVISION,
      ...headers,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10000),
  });
  const text = res.ok ? "" : await res.text().catch(() => "");
  return { status: res.status, ok: res.ok, text };
}

export async function POST(request: Request) {
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

  const email = body.email?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const source = body.source || "Website";
  const properties = { "Signup Source": source, ...(body.properties || {}) };
  const marketingConsent = { email: { marketing: { consent: "SUBSCRIBED" } } };
  const stages: Stage[] = [];

  // -------------------------------------------------------------------------
  // Path A: private API key (server-side only). Two documented calls:
  //   1) upsert the profile so custom properties are stored,
  //   2) subscribe it with marketing consent to the Email List. This is the
  //      call that fires "Subscribed to List" for the Welcome Flow.
  // Custom properties are NOT valid inside the subscribe payload, which is why
  // they go through the profile call.
  // -------------------------------------------------------------------------
  const apiKey = process.env.KLAVIYO_API_KEY;
  if (apiKey) {
    const auth = { Authorization: `Klaviyo-API-Key ${apiKey}` };
    try {
      const upsert = await klaviyoRequest("/api/profile-import/", auth, {
        data: { type: "profile", attributes: { email, properties } },
      });
      stages.push({ stage: "profile-upsert", status: upsert.status });
      if (!upsert.ok) console.error(`[Klaviyo] profile-upsert ${upsert.status}:`, upsert.text.slice(0, 300));
    } catch (err) {
      stages.push({ stage: "profile-upsert", status: "network_error" });
      console.error("[Klaviyo] profile-upsert exception:", err);
    }

    try {
      const sub = await klaviyoRequest("/api/profile-subscription-bulk-create-jobs/", auth, {
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            custom_source: source,
            profiles: {
              data: [{ type: "profile", attributes: { email, subscriptions: marketingConsent } }],
            },
          },
          relationships: { list: { data: { type: "list", id: LIST_ID } } },
        },
      });
      stages.push({ stage: "subscribe-private", status: sub.status });
      if (sub.ok) {
        console.log(`[Klaviyo] ✓ Subscribed via private API ("${source}")`);
        return NextResponse.json({ success: true, via: "private" });
      }
      console.error(`[Klaviyo] subscribe-private ${sub.status}:`, sub.text.slice(0, 300));
    } catch (err) {
      stages.push({ stage: "subscribe-private", status: "network_error" });
      console.error("[Klaviyo] subscribe-private exception:", err);
    }
  } else {
    stages.push({ stage: "subscribe-private", status: "skipped" });
    console.error("[Klaviyo] KLAVIYO_API_KEY is not set; using the public subscribe endpoint");
  }

  // -------------------------------------------------------------------------
  // Path B: Klaviyo's public client subscribe endpoint. Uses only the public
  // site ID (no secret), so it still works if the private key is missing or
  // lacks a scope. Also adds to the list and fires the same list events.
  // -------------------------------------------------------------------------
  const publicPayload = (withProperties: boolean) => ({
    data: {
      type: "subscription",
      attributes: {
        custom_source: source,
        profile: {
          data: {
            type: "profile",
            attributes: {
              email,
              subscriptions: marketingConsent,
              ...(withProperties ? { properties } : {}),
            },
          },
        },
      },
      relationships: { list: { data: { type: "list", id: LIST_ID } } },
    },
  });

  // If Klaviyo rejects the custom properties, retry with just email + consent
  // so the subscription (and the Welcome Flow) still goes through.
  for (const withProperties of [true, false]) {
    const stage = withProperties ? "subscribe-public" : "subscribe-public-minimal";
    try {
      const pub = await klaviyoRequest(`/client/subscriptions/?company_id=${COMPANY_ID}`, {}, publicPayload(withProperties));
      stages.push({ stage, status: pub.status });
      if (pub.ok) {
        console.log(`[Klaviyo] ✓ Subscribed via public endpoint ("${source}")`);
        return NextResponse.json({ success: true, via: "public" });
      }
      console.error(`[Klaviyo] ${stage} ${pub.status}:`, pub.text.slice(0, 300));
      if (pub.status !== 400) break;
    } catch (err) {
      stages.push({ stage, status: "network_error" });
      console.error(`[Klaviyo] ${stage} exception:`, err);
      break;
    }
  }

  // Statuses only: never echo the key, the email, or Klaviyo's raw error body.
  return NextResponse.json({ error: "subscribe_failed", stages }, { status: 502 });
}
