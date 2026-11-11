import { CLOSEOUT_BUNDLES, CLOSEOUT_LIVE, CLOSEOUT_SHIPPING_CODE, type CloseoutSize } from '@/app/data/closeoutOffer';
import { buildOneTimeCheckoutUrl } from '@/app/lib/checkoutAttribution';

/** One inventory-linked bundle, never N units of the bundle or a regular pouch. */
export function buildCloseoutCheckoutUrl(size: CloseoutSize): string | null {
  const bundle = CLOSEOUT_BUNDLES[size];
  if (!CLOSEOUT_LIVE || !bundle?.variantId) return null;
  const url = new URL(buildOneTimeCheckoutUrl([`${bundle.variantId}:1`]));
  // The five-pouch bundle already qualifies for the standard $50 threshold.
  // Applying the shipping code to that offer produces an unnecessary Shopify warning.
  if (size === 2 && CLOSEOUT_SHIPPING_CODE) url.searchParams.set('discount', CLOSEOUT_SHIPPING_CODE);
  return url.toString();
}
