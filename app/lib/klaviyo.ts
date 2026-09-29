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

// ---------------------------------------------------------------------------
// Klaviyo onsite script + signup form
// ---------------------------------------------------------------------------

export const KLAVIYO_COMPANY_ID = "XLatdi";

/**
 * ID of the Klaviyo form "Atlas - 10% Welcome Capture v1" (Klaviyo > Sign-up
 * forms > the form > its ID). Set NEXT_PUBLIC_KLAVIYO_WELCOME_FORM_ID, or
 * paste the ID here. While empty, the top-bar "Unlock 10% Off" message is
 * hidden so it never points at nothing.
 */
export const KLAVIYO_WELCOME_FORM_ID = process.env.NEXT_PUBLIC_KLAVIYO_WELCOME_FORM_ID ?? "";

const KLAVIYO_SCRIPT_ID = "klaviyo-onsite";

declare global {
  interface Window {
    _klOnsite?: unknown[];
  }
}

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

/**
 * Opens the Klaviyo welcome form. Loading the script here is intentional: the
 * visitor asked for the signup, so it isn't gated on the cookie banner.
 * Klaviyo processes queued _klOnsite commands once its script has loaded.
 */
export function openWelcomeForm(): boolean {
  if (!KLAVIYO_WELCOME_FORM_ID) return false;
  loadKlaviyo();
  window._klOnsite = window._klOnsite || [];
  window._klOnsite.push(["openForm", KLAVIYO_WELCOME_FORM_ID]);
  return true;
}
