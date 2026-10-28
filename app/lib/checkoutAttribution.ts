// Shopify's published UCP profile advertises this endpoint (verified 2026-10-28).
// https://shopify.dev/docs/agents/carts-and-checkout/permalinks
const ENDPOINT = "https://7fa7b7-42.myshopify.com/buy";
const KEY = "atlas_checkout_attribution";
const CONSENT_KEY = "atlas_cookie_consent";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
const MAX_AGE = 24 * 60 * 60 * 1000;
type Attribution = { savedAt: number; fields: Record<string, string> };

// Only explicitly allowed campaign fields, never arbitrary URL/customer data.
export function captureCheckoutAttribution(accepted: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (!accepted) {
      // React initially renders before CookieConsent has read the saved choice.
      if (localStorage.getItem(CONSENT_KEY) !== "accepted") sessionStorage.removeItem(KEY);
      return;
    }
    const query = new URL(window.location.href).searchParams;
    const fields: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const value = query.get(key);
      if (value && value.length <= 160 && !/[\x00-\x1f]/.test(value)) fields[key] = value;
    }
    const click = query.get("fbclid");
    if (click && /^[A-Za-z0-9_-]{1,512}$/.test(click)) {
      fields.click_id_tag = "fbclid";
      fields.click_id_value = click;
    }
    // Internal navigation must not overwrite the original campaign.
    if (Object.keys(fields).length) {
      sessionStorage.setItem(KEY, JSON.stringify({ savedAt: Date.now(), fields }));
    }
  } catch { /* Storage may be blocked; checkout must still work. */ }
}

export function buildOneTimeCheckoutUrl(lines: string[]) {
  const url = new URL(`${ENDPOINT}/${lines.join(",")}`);
  url.searchParams.set("ucp/version", "2026-08-25");
  try {
    if (localStorage.getItem(CONSENT_KEY) !== "accepted") return url.toString();
    captureCheckoutAttribution(true);
    const saved: Attribution = JSON.parse(sessionStorage.getItem(KEY) || "null");
    if (!saved || Date.now() - saved.savedAt > MAX_AGE || saved.savedAt > Date.now()) return url.toString();
    // Keep the click ID ahead of optional UTMs within Shopify's 2,048-byte limit.
    if (saved.fields?.click_id_tag === "fbclid" && typeof saved.fields.click_id_value === "string" && /^[A-Za-z0-9_-]{1,512}$/.test(saved.fields.click_id_value)) {
      url.searchParams.set("attribution/click_id_tag", "fbclid");
      url.searchParams.set("attribution/click_id_value", saved.fields.click_id_value);
    }
    for (const key of UTM_KEYS) {
      const value = saved.fields?.[key];
      if (typeof value !== "string" || !value || value.length > 160 || /[\x00-\x1f]/.test(value)) continue;
      url.searchParams.set(`attribution/${key}`, value);
      if (url.toString().length > 2048) url.searchParams.delete(`attribution/${key}`);
    }
  } catch { /* A missing or invalid attribution record never blocks checkout. */ }
  return url.toString();
}
