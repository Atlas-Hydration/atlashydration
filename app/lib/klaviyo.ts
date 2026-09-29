/**
 * Klaviyo integration (browser side, no API key, no server route).
 *
 * - The 10% popup subscribes the email straight to Klaviyo's public client
 *   endpoint (public site ID only) and adds it to the Email List (XDwcHp),
 *   which is what triggers the Welcome Flow.
 * - If that call fails, the popup falls back to Klaviyo's native onsite form.
 */

export const KLAVIYO_COMPANY_ID = "XLatdi";

/** "Email List" that the Welcome Flow is triggered from. */
export const KLAVIYO_LIST_ID = "XDwcHp";

/** Native signup form "Atlas - 10% Welcome Capture v1" (connected to list XDwcHp). */
export const KLAVIYO_WELCOME_FORM_ID = "WKzyzF";

const KLAVIYO_SCRIPT_ID = "klaviyo-onsite";

declare global {
  interface Window {
    _klOnsite?: unknown[];
  }
}

let scriptFailed = false;

/** Loads klaviyo.js once, no matter how many callers ask. */
export function loadKlaviyo(): HTMLScriptElement | null {
  if (typeof document === "undefined") return null;
  const existing = document.getElementById(KLAVIYO_SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) return existing;
  scriptFailed = false;
  const script = document.createElement("script");
  script.id = KLAVIYO_SCRIPT_ID;
  script.async = true;
  script.src = `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${KLAVIYO_COMPANY_ID}`;
  script.addEventListener("error", () => {
    // Blocked by an ad/privacy blocker, the network, or CSP. Drop the tag so
    // the next click can try again.
    scriptFailed = true;
    script.remove();
    console.error("[Klaviyo] klaviyo.js failed to load (ad blocker, network, or CSP).");
  });
  document.head.appendChild(script);
  return script;
}

let listening = false;

/** Logs Klaviyo's form lifecycle events (open, submit, close…) for debugging. */
function logFormEvents(): void {
  if (listening) return;
  listening = true;
  window.addEventListener("klaviyoForms", (e) => {
    console.info("[Klaviyo form]", (e as CustomEvent).detail);
  });
}

function showBlockedNotice(): void {
  if (document.getElementById("klaviyo-blocked-notice")) return;
  const el = document.createElement("div");
  el.id = "klaviyo-blocked-notice";
  el.setAttribute("role", "alert");
  el.textContent =
    "We couldn't load the signup form. If you use an ad blocker, turn it off for this site and try again.";
  el.style.cssText =
    "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2147483000;max-width:min(92vw,420px);padding:14px 18px;background:#1d1d1f;color:#fff;font:500 14px/1.4 Inter,system-ui,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.3);text-align:center";
  document.body.appendChild(el);
  window.setTimeout(() => el.remove(), 7000);
}

/**
 * Opens the native welcome form. Calls queued on window._klOnsite are replayed
 * by klaviyo.js once it has loaded, so this is safe to call before the script
 * is ready (and it loads the script itself if it isn't on the page yet).
 */
export function openWelcomeForm(): void {
  if (typeof window === "undefined") return;
  logFormEvents();
  window._klOnsite = window._klOnsite || [];
  window._klOnsite.push(["openForm", KLAVIYO_WELCOME_FORM_ID]);
  if (scriptFailed) {
    showBlockedNotice();
    scriptFailed = false;
  }
  const script = loadKlaviyo();
  script?.addEventListener("error", showBlockedNotice, { once: true });
}

export type SubscribeResult = "ok" | "rate_limited" | "error";

/**
 * Subscribes an email to the Email List via Klaviyo's public client API.
 * Resolves "ok" only when Klaviyo accepts it (HTTP 202), never before.
 */
export async function subscribeToKlaviyoPublic({
  email,
  source,
  properties = {},
}: {
  email: string;
  source: string;
  properties?: Record<string, string>;
}): Promise<SubscribeResult> {
  const payload = (withProperties: boolean) => ({
    data: {
      type: "subscription",
      attributes: {
        custom_source: source,
        profile: {
          data: {
            type: "profile",
            attributes: {
              email,
              subscriptions: { email: { marketing: { consent: "SUBSCRIBED" } } },
              ...(withProperties ? { properties: { "Signup Source": source, ...properties } } : {}),
            },
          },
        },
      },
      relationships: { list: { data: { type: "list", id: KLAVIYO_LIST_ID } } },
    },
  });

  // If Klaviyo rejects the custom properties, retry with email + consent only
  // so the subscription (and the Welcome Flow) still goes through.
  for (const withProperties of [true, false]) {
    try {
      const res = await fetch(
        `https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_COMPANY_ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", revision: "2024-10-15" },
          body: JSON.stringify(payload(withProperties)),
        }
      );
      if (res.ok) return "ok";
      if (res.status === 429) return "rate_limited";
      console.error("[Klaviyo] subscribe failed:", res.status, await res.text().catch(() => ""));
      if (res.status !== 400) return "error";
    } catch (err) {
      console.error("[Klaviyo] subscribe exception:", err);
      return "error";
    }
  }
  return "error";
}
