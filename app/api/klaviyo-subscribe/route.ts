import { NextResponse } from "next/server";

const LIST_ID = "XDwcHp"; // Atlas Hydration Email List

export async function POST(request: Request) {
  const apiKey = process.env.KLAVIYO_API_KEY;
  if (!apiKey) {
    console.error("[Klaviyo] Missing KLAVIYO_API_KEY env var");
    return NextResponse.json({ error: "Server config error" }, { status: 500 });
  }

  let body: { email?: string; source?: string; properties?: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
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
