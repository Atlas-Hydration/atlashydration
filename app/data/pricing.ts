/**
 * Single source of truth for pouch pricing shown on the storefront.
 *
 * WHAT CHECKOUT ACTUALLY CHARGES COMES FROM SHOPIFY, NOT THIS FILE:
 *   - one-time price  = the Shopify variant price (per flavor)
 *   - 2-pouch price   = variant price x 2 minus the Shopify "ATLAS2PACK" code
 *   - subscription    = the Appstle selling plan's 20% discount on the variant
 * The storefront only *displays* those numbers, so the new prices must never go
 * live here until Shopify matches (see PRICING_V2_LIVE below).
 *
 * Switching to the new prices (in this order, so every intermediate state is at
 * worst in the customer's favor):
 *   1. Shopify discount ATLAS2PACK: change $5.00 off to $9.00 off
 *      (2 x $31.99 = $63.98, minus $9.00 = $54.98).
 *   2. Shopify variant price: $29.99 -> $31.99 for Strawberry Lemonade
 *      (42739482067018) and Grapefruit (41850457817162).
 *   3. Appstle selling plans (2/4/6 weeks): confirm they are "20% off" so the
 *      subscription charges $25.59 (31.99 x 0.80).
 *   4. Set PRICING_V2_LIVE = true below.
 *
 * Status: switched ON after the Shopify variant prices were raised to $31.99 and
 * the Appstle plans were confirmed as "Save 20% from first order onward"
 * (percentage-based, so it yields $25.59). ATLAS2PACK must be $9.00 off.
 */
export const PRICING_V2_LIVE = true;

const round2 = (n: number) => Math.round(n * 100) / 100;

const SINGLE_PRICE = PRICING_V2_LIVE ? 31.99 : 29.99;

/** The Stock Up (2 pouch) selling price. Unchanged by the price increase. */
export const TWO_POUCH_PRICE = 54.98;

export const SUBSCRIBE_DISCOUNT_PERCENT = 20;
export const STICKS_PER_POUCH = 16;

export const POUCH_PRICES = {
  single: SINGLE_PRICE,
  /** 20% off the retail price, rounded to the cent. */
  subscribe: round2(SINGLE_PRICE * (1 - SUBSCRIBE_DISCOUNT_PERCENT / 100)),
  perStick: round2(SINGLE_PRICE / STICKS_PER_POUCH),
  subscribePerStick: round2((SINGLE_PRICE * (1 - SUBSCRIBE_DISCOUNT_PERCENT / 100)) / STICKS_PER_POUCH),
} as const;

/**
 * What the 2-pouch code must take off so that two pouches cost TWO_POUCH_PRICE.
 * This is the value the Shopify ATLAS2PACK discount has to match.
 * ($5.00 at $29.99, $9.00 at $31.99.)
 */
export const TWO_POUCH_DISCOUNT = round2(SINGLE_PRICE * 2 - TWO_POUCH_PRICE);
