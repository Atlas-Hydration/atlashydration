/** Keep false until both Shopify bundle checkouts and U.S. shipping pass release QA. */
export const CLOSEOUT_LIVE = false;

export const CLOSEOUT_IMAGE = 'https://cdn.shopify.com/s/files/1/0595/8133/3578/files/1_e4b7eae7-01d9-430c-9655-7949d910deb6.jpg?v=1771507844';

export const CLOSEOUT_BUNDLES = {
  5: { pouches: 5, sticks: 80, price: 50, perPouch: 10, variantId: '' },
  2: { pouches: 2, sticks: 32, price: 32, perPouch: 16, variantId: '' },
} as const;
export type CloseoutSize = keyof typeof CLOSEOUT_BUNDLES;

// Shopify, not the storefront, must honor the complete offer.
export const CLOSEOUT_SHIPPING_CODE = '';
