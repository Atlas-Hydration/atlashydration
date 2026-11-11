/** Single-bundle Shopify payment-step totals and standard U.S. shipping verified before activation. */
export const CLOSEOUT_LIVE = true;

export const CLOSEOUT_IMAGE = 'https://cdn.shopify.com/s/files/1/0595/8133/3578/files/1_e4b7eae7-01d9-430c-9655-7949d910deb6.jpg?v=1771507844';

export const CLOSEOUT_BUNDLES = {
  5: { pouches: 5, sticks: 80, price: 50, perPouch: 10, variantId: '67946324754506' },
  2: { pouches: 2, sticks: 32, price: 32, perPouch: 16, variantId: '67946326261834' },
} as const;
export type CloseoutSize = keyof typeof CLOSEOUT_BUNDLES;

// Shopify, not the storefront, must honor the complete offer.
export const CLOSEOUT_SHIPPING_CODE = 'ATLAS-CLOSEOUT-SHIP';
