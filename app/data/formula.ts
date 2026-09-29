/**
 * Electrolyte figures mirror the Supplement Facts panel (600 + 500 + 200 + 469
 * = 1,769mg). Calories are per the owner's brief and NOT yet confirmed against
 * the label (the panel historically read 5).
 */
export const FORMULA = {
  totalElectrolytesMg: 1769,
  sodiumMg: 600,
  potassiumMg: 500,
  magnesiumMg: 200,
  chlorideMg: 469,
  calories: 25,
  sugarG: 0,
} as const;

export const FORMULA_TOTAL = FORMULA.totalElectrolytesMg.toLocaleString("en-US");

export const FORMULA_ELECTROLYTE_BREAKDOWN = `${FORMULA.sodiumMg}mg sodium, ${FORMULA.potassiumMg}mg potassium, ${FORMULA.magnesiumMg}mg magnesium, and ${FORMULA.chlorideMg}mg chloride`;

/** Shipping threshold used by the cart, buy boxes, and shipping policy page. */
export const FREE_SHIPPING_THRESHOLD = 40;

/** Standard shipping rate under the free-shipping threshold (see /shipping). */
export const SHIPPING_RATE = 4.99;
