/**
 * Right-size images served from Shopify's CDN. Shopify resizes on the fly when
 * a `width` query parameter is present, so phones don't download desktop-sized
 * photos. Non-Shopify URLs (local files) are returned unchanged.
 */
export function resizeShopify(url: string, width: number): string {
  if (!url.includes("cdn.shopify.com")) return url;
  try {
    const u = new URL(url);
    u.searchParams.set("width", String(width));
    return u.toString();
  } catch {
    return url;
  }
}

export function shopifySrcSet(url: string, widths: number[] = [480, 800, 1200]): string | undefined {
  if (!url.includes("cdn.shopify.com")) return undefined;
  return widths.map((w) => `${resizeShopify(url, w)} ${w}w`).join(", ");
}
