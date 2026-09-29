/**
 * Current Strawberry Lemonade formula figures. Use these instead of typing
 * numbers into copy so the storefront can't drift out of sync again.
 * Potassium is intentionally amount-less: only its inclusion is confirmed.
 */
export const FORMULA = {
  totalElectrolytesMg: 1769,
  sodiumMg: 510,
  magnesiumMg: 380,
  calories: 25,
  sugarG: 0,
} as const;

export const FORMULA_TOTAL = FORMULA.totalElectrolytesMg.toLocaleString("en-US");

/** "1,769mg total electrolytes: 510mg sodium, 380mg magnesium, and potassium" */
export const FORMULA_ELECTROLYTE_BREAKDOWN = `${FORMULA.sodiumMg}mg sodium, ${FORMULA.magnesiumMg}mg magnesium, and potassium`;

/** Shipping threshold used by the cart, buy boxes, and shipping policy page. */
export const FREE_SHIPPING_THRESHOLD = 40;
