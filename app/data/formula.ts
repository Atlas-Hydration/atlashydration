/**
 * Mirrors the Strawberry Lemonade Supplement Facts label (owner-confirmed):
 * 1 stick (12g), 25 calories, 6g carbs, 600mg sodium, 200mg magnesium,
 * 500mg potassium. The label lists no chloride. NOTE: those three electrolytes
 * sum to 1,300mg, so the "1,769mg total electrolytes" marketing figure is not
 * derivable from the label alone (owner to confirm).
 */
export const FORMULA = {
  totalElectrolytesMg: 1769,
  sodiumMg: 600,
  potassiumMg: 500,
  magnesiumMg: 200,
  calories: 25,
  carbsG: 6,
  servingG: 12,
  sugarG: 0,
} as const;

export const FORMULA_TOTAL = FORMULA.totalElectrolytesMg.toLocaleString("en-US");

export const FORMULA_ELECTROLYTE_BREAKDOWN = `${FORMULA.sodiumMg}mg sodium, ${FORMULA.potassiumMg}mg potassium, and ${FORMULA.magnesiumMg}mg magnesium`;

/**
 * Free-shipping threshold used by the cart, buy boxes, banners, and the shipping
 * policy page. Shopify's shipping rate is authoritative: this only mirrors it for
 * messaging. UNVERIFIED against Shopify admin (see docs/MEASUREMENT.md and
 * docs/PRICING.md, "Free shipping"); a change in Shopify means changing this one
 * number (plus public/llms.txt, which is static text).
 */
export const FREE_SHIPPING_THRESHOLD = 40;

/**
 * Does an order of this size (USD) ship free? Subscription orders always do and
 * are handled by callers. At current prices no cart totals exactly the threshold
 * (scripts/check-shipping-boundary.mjs), so "at least" vs "over" gives the same
 * answer for every cart a shopper can build today.
 */
export function qualifiesForFreeShipping(amount: number): boolean {
  return amount >= FREE_SHIPPING_THRESHOLD;
}

/** Standard shipping rate under the free-shipping threshold (see /shipping). */
export const SHIPPING_RATE = 4.99;
