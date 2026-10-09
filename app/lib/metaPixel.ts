// Browser events only. Shopify remains responsible for Purchase/CAPI.
export const META_PIXEL_ID = "1949506255832708";
export const CONSENT_KEY = "atlas_cookie_consent";
type EventName = "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout";
type Pixel = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  loaded: boolean;
  version: string;
  push: Pixel;
  disablePushState: boolean;
};
declare global {
  interface Window { fbq?: Pixel; _fbq?: Pixel }
}
let allowed = false;
let initialized = false;

export function setMetaConsent(accepted: boolean) {
  if (typeof window === "undefined") return;
  allowed = accepted;
  if (!accepted) {
    // Drop pending events rather than replaying them on a later opt-in.
    if (window.fbq && !window.fbq.callMethod) {
      window.fbq.queue = window.fbq.queue.filter((args) => args[0] !== "trackSingle");
    }
    window.fbq?.("consent", "revoke");
    return;
  }
  if (!initialized) {
    // Do not take ownership of another installation or change its settings.
    if (window.fbq) { allowed = false; return; }
    const pixel = function (...args: unknown[]) {
      if (pixel.callMethod) pixel.callMethod(...args);
      else pixel.queue.push(args);
    } as Pixel;
    pixel.queue = [];
    pixel.loaded = true;
    pixel.version = "2.0";
    pixel.push = pixel;
    pixel.disablePushState = true;
    window.fbq = pixel;
    window._fbq = pixel;
    pixel("consent", "grant");
    pixel("set", "autoConfig", false, META_PIXEL_ID);
    // No advanced matching object, form scraping or customer identifiers.
    pixel("init", META_PIXEL_ID);
    initialized = true;
    const script = document.createElement("script");
    script.id = "atlas-meta-pixel";
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  } else {
    window.fbq?.("consent", "grant");
  }
}

export function trackMeta(event: EventName, data: Record<string, unknown> = {}) {
  if (!allowed || !initialized || typeof window === "undefined") return;
  window.fbq?.("trackSingle", META_PIXEL_ID, event, data);
}
