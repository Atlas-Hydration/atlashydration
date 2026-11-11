import { CLOSEOUT_BUNDLES, CLOSEOUT_LIVE, CLOSEOUT_SHIPPING_CODE, type CloseoutSize } from '@/app/data/closeoutOffer';
import { buildOneTimeCheckoutUrl } from '@/app/lib/checkoutAttribution';

/** One inventory-linked bundle, never N units of the bundle or a regular pouch. */
export function buildCloseoutCheckoutUrl(size: CloseoutSize): string | null {
  const bundle = CLOSEOUT_BUNDLES[size];
  if (!CLOSEOUT_LIVE || !bundle?.variantId) return null;
  const url = new URL(buildOneTimeCheckoutUrl([`${bundle.variantId}:1`]));
  if (CLOSEOUT_SHIPPING_CODE) url.searchParams.set('discount', CLOSEOUT_SHIPPING_CODE);
  return url.toString();
}
