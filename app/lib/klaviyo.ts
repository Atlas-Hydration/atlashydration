/**
 * Klaviyo onsite integration.
 *
 * The 10% welcome signup is Klaviyo's native onsite form. Klaviyo renders it,
 * collects the email, subscribes the profile to the Email List (XDwcHp) and
 * triggers the Welcome Flow. Nothing here touches a Klaviyo API key.
 */

export const KLAVIYO_COMPANY_ID = "XLatdi";

/** Native signup form "Atlas - 10% Welcome Capture v1" (connected to list XDwcHp). */
export const KLAVIYO_WELCOME_FORM_ID = "WKzyzF";

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
 * Opens the native welcome form. Calls queued on window._klOnsite are replayed
 * by klaviyo.js once it has loaded, so this is safe to call before the script
 * is ready (and it loads the script itself if the visitor hasn't yet).
 */
export function openWelcomeForm(): void {
  if (typeof window === "undefined") return;
  window._klOnsite = window._klOnsite || [];
  window._klOnsite.push(["openForm", KLAVIYO_WELCOME_FORM_ID]);
  loadKlaviyo();
}
