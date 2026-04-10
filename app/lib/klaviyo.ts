/**
 * Klaviyo client-side subscribe helper
 *
 * Uses Klaviyo's Client API Subscriptions endpoint — no private API key needed.
 * Only requires the company_id (public site ID).
 *
 * Docs: https://developers.klaviyo.com/en/reference/create_client_subscription
 */

// Klaviyo public site ID (safe to expose — this is the company_id, not a private API key)
const KLAVIYO_COMPANY_ID = "XLatdi";

// Default list ID for general email signups
// From: Klaviyo → Audience → Lists → Email List → Settings → List ID
const DEFAULT_LIST_ID = "XDwcHp";

interface SubscribeOptions {
  email: string;
  listId?: string;
  source?: string;
  properties?: Record<string, string>;
}

export async function subscribeToKlaviyo({
  email,
  listId = DEFAULT_LIST_ID,
  source = "Website",
  properties = {},
}: SubscribeOptions): Promise<boolean> {
  try {
    const res = await fetch(
      `https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_COMPANY_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          revision: "2024-10-15",
        },
        body: JSON.stringify({
          data: {
            type: "subscription",
            attributes: {
              custom_source: source,
              profile: {
                data: {
                  type: "profile",
                  attributes: {
                    email,
                    properties: {
                      "Signup Source": source,
                      ...properties,
                    },
                  },
                },
              },
            },
            relationships: {
              list: {
                data: { type: "list", id: listId },
              },
            },
          },
        }),
      }
    );

    // Klaviyo returns 202 Accepted on success (async subscription processing)
    return res.ok || res.status === 202;
  } catch (err) {
    console.error("[Klaviyo] Subscribe failed:", err);
    return false;
  }
}
