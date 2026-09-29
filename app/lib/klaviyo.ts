/**
 * Klaviyo subscribe helper (client → server route)
 *
 * Calls our own /api/klaviyo-subscribe endpoint which uses the Private API Key
 * server-side. This avoids CORS issues and client-side API complexity.
 */

interface SubscribeOptions {
  email: string;
  source?: string;
  properties?: Record<string, string>;
}

export async function subscribeToKlaviyo({
  email,
  source = "Website",
  properties = {},
}: SubscribeOptions): Promise<boolean> {
  try {
    const res = await fetch("/api/klaviyo-subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source, properties }),
    });

    if (res.ok) {
      console.log(`[Klaviyo] ✓ Subscribed ${email}`);
      return true;
    }

    const errJson = await res.json().catch(() => ({}));
    console.error(`[Klaviyo] ✗ Subscribe failed:`, res.status, errJson);
    return false;
  } catch (err) {
    console.error("[Klaviyo] ✗ Subscribe exception:", err);
    return false;
  }
}

export type SubscribeResult = "ok" | "rate_limited" | "error";

/** Same call as subscribeToKlaviyo, but tells the UI why it failed. */
export async function subscribeToKlaviyoWithStatus({
  email,
  source = "Website",
  properties = {},
}: SubscribeOptions): Promise<SubscribeResult> {
  try {
    const res = await fetch("/api/klaviyo-subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source, properties }),
    });
    if (res.ok) return "ok";
    // The route returns only the failing stage names + HTTP statuses (no secrets).
    const detail = await res.json().catch(() => ({}));
    console.error("[Klaviyo] ✗ Subscribe failed:", res.status, detail);
    return res.status === 429 ? "rate_limited" : "error";
  } catch (err) {
    console.error("[Klaviyo] ✗ Subscribe exception:", err);
    return "error";
  }
}

// ---------------------------------------------------------------------------
// Klaviyo onsite script (tracking + any forms configured in Klaviyo)
// ---------------------------------------------------------------------------

export const KLAVIYO_COMPANY_ID = "XLatdi";

const KLAVIYO_SCRIPT_ID = "klaviyo-onsite";

/** Loads klaviyo.js once, no matter how many callers ask. */
export function loadKlaviyo(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(KLAVIYO_SCRIPT_ID)) return;
  const script = document.createElement("script");
  script.id = KLAVIYO_SCRIPT_ID;
  script.async = true;
  script.src = `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${KLAVIYO_COMPANY_ID}`;
  document.head.appendChild(script);
}
