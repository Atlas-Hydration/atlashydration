/**
 * Atlas Hydration pricing: the ONE place storefront prices are defined.
 * Full offer table and checkout QA matrix: docs/PRICING.md.
 *
 * SHOPIFY CHECKOUT IS THE SOURCE OF TRUTH. This file only mirrors what Shopify
 * is actually configured to do so the storefront can show expected totals. Never
 * add a discount here that does not exist in Shopify.
 *
 * What exists in Shopify today:
 *   - Variant prices: pouch $31.99 (both flavors), bottle $19.99.
 *   - ATLAS2PACK: AUTOMATIC product discount, fixed $2.50 off EACH pouch,
 *     minimum 2 items, both flavors, one-time purchases only. Shopify applies
 *     it on its own, so the storefront sends NO discount code.
 *   - Subscription: Appstle selling plans (2/4/6 weeks), "Save 20% from first
 *     order onward". Not combined with ATLAS2PACK.
 *   - Free shipping: a Shopify shipping-rate threshold (orders over $40) and
 *     free on subscriptions. The storefront only messages it.
 *   - Welcome code ATLASWELCOME10: typed by the customer at checkout. The
 *     storefront never applies or stacks it.
 *
 * Bottle promotion (50% off at 2 pouches, free at 4): shown on the storefront
 * while BOTTLE_DISCOUNT_LIVE is true (app/context/CartContext.tsx). It only
 * matches checkout because Shopify has matching automatic discounts. Shopify does
 * NOT apply ATLAS2PACK together with a bottle discount; it gives the larger one
 * (docs/PRICING.md, "Platform rule"). The cart mirrors that in computeCartPricing.
 */

const round2 = (n: number) => Math.round(n * 100) / 100;

// ---------------------------------------------------------------------------
// Pouches
// ---------------------------------------------------------------------------

/** Retail price of one 16-stick pouch (either flavor). */
export const POUCH_RETAIL = 31.99;
export const STICKS_PER_POUCH = 16;

/** ATLAS2PACK: dollars off EACH one-time pouch once the cart has 2+. */
export const MULTI_POUCH_DISCOUNT_PER_POUCH = 2.5;
export const MULTI_POUCH_MIN_QTY = 2;

export const SUBSCRIBE_DISCOUNT_PERCENT = 20;

export const POUCH_PRICES = {
  single: POUCH_RETAIL,
  /** 20% off retail, rounded to the cent ($25.59). Appstle computes the real charge. */
  subscribe: round2(POUCH_RETAIL * (1 - SUBSCRIBE_DISCOUNT_PERCENT / 100)),
  perStick: round2(POUCH_RETAIL / STICKS_PER_POUCH),
  subscribePerStick: round2((POUCH_RETAIL * (1 - SUBSCRIBE_DISCOUNT_PERCENT / 100)) / STICKS_PER_POUCH),
} as const;

/** ATLAS2PACK discount for `qty` one-time pouches ($0 below the minimum). */
export function multiPouchDiscount(qty: number): number {
  return qty >= MULTI_POUCH_MIN_QTY ? round2(MULTI_POUCH_DISCOUNT_PER_POUCH * qty) : 0;
}

/** What `qty` one-time pouches cost after ATLAS2PACK. */
export function oneTimePouchTotal(qty: number): number {
  return round2(qty * POUCH_RETAIL - multiPouchDiscount(qty));
}

// ---------------------------------------------------------------------------
// Bottle
// ---------------------------------------------------------------------------

/** Retail price of the Atlas Performance Bottle (Shopify variant price). */
export const BOTTLE_RETAIL = 19.99;

/**
 * Bottle price with the 50%-off promotion. Shopify takes the half off rounded
 * DOWN to the cent: a live checkout (2026-09-30) showed "BUY 2 PACK GET 50% OFF
 * BOTTLE (-$9.99)" on the $19.99 bottle, so the bottle costs $10.00.
 */
export const BOTTLE_HALF_DISCOUNT = Math.floor(Math.round(BOTTLE_RETAIL * 100) * 0.5) / 100;
export const BOTTLE_HALF_PRICE = round2(BOTTLE_RETAIL - BOTTLE_HALF_DISCOUNT);
