import { CLOSEOUT_BUNDLES, CLOSEOUT_SHIPPING_CODE, type CloseoutSize } from '@/app/data/closeoutOffer';
import { buildOneTimeCheckoutUrl } from '@/app/lib/checkoutAttribution';

/** One inventory-linked bundle, not multiple units of that bundle. */
export function buildCloseoutCheckoutUrl(size: CloseoutSize): string {
  const url = new URL(buildOneTimeCheckoutUrl([`${CLOSEOUT_BUNDLES[size].variantId}:1`]));
  // Five pouches qualify for the existing $50 free-shipping threshold.
  if (size === 2) url.searchParams.set('discount', CLOSEOUT_SHIPPING_CODE);
  return url.toString();
}
