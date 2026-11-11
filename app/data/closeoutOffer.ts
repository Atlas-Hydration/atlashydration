/** Verified inventory-linked, one-time Shopify bundles. */
export const CLOSEOUT_BUNDLES = {
  5: { pouches: 5, sticks: 80, price: 50, perPouch: 10, variantId: '67946324754506' },
  2: { pouches: 2, sticks: 32, price: 32, perPouch: 16, variantId: '67946326261834' },
} as const;
export type CloseoutSize = keyof typeof CLOSEOUT_BUNDLES;
export const CLOSEOUT_SHIPPING_CODE = 'ATLAS-CLOSEOUT-SHIP';
