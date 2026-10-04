/**
 * Purchase state: the ONE definition of what a shopper has selected on a buy box
 * and which cart lines that selection means. No imports on purpose, so it can be
 * unit-tested directly (scripts/test-purchase-state.mjs).
 *
 * Every add-to-cart button (buy box, sticky bar, bottom Order button, on the home
 * page and the product pages) reads the selection from PurchaseSelectionContext
 * and submits `purchaseLines(state)`. Shopify stays authoritative for prices,
 * discounts, selling plans and shipping; this only decides WHICH variant,
 * quantity and purchase type is submitted.
 *
 * Purchase type is carried by `subscriptionFrequency` alone: a line has it
 * (checkout then sends the matching Appstle selling_plan) or it does not (a
 * one-time line, which never carries a selling plan).
 */

export type PurchaseFlavor = "strawberry-lemonade" | "grapefruit";
export type PurchaseType = "subscribe" | "onetime";
/** The three offer rows in the buy box. */
export type OfferId = "try" | "stock-up" | "subscribe";

export const SUBSCRIPTION_FREQUENCIES = [2, 4, 6] as const;
export const DEFAULT_FREQUENCY = 2;
export const MAX_PURCHASE_QTY = 20;
/** What the buy box shows when nothing else is specified. */
export const DEFAULT_OFFER: OfferId = "subscribe";

export interface PurchaseState {
  flavor: PurchaseFlavor;
  purchaseType: PurchaseType;
  /** Weeks between deliveries; only used when purchaseType is "subscribe". */
  frequency: number;
  qty: number;
  customQtyOpen: boolean;
  addBottle: boolean;
}

export interface PurchaseLine {
  slug: string;
  quantity: number;
  /** Present only for subscription lines. */
  subscriptionFrequency?: number;
}

/** Selection state for one of the offer rows. */
export function offerState(offer: OfferId, flavor: PurchaseFlavor): PurchaseState {
  const base = { flavor, frequency: DEFAULT_FREQUENCY, customQtyOpen: false, addBottle: false };
  if (offer === "try") return { ...base, purchaseType: "onetime", qty: 1 };
  if (offer === "stock-up") return { ...base, purchaseType: "onetime", qty: 2 };
  return { ...base, purchaseType: "subscribe", qty: 1 };
}

/** The optional bottle add-on is only offered with the plain 2-pouch one-time row. */
export function bottleIncluded(state: PurchaseState, bottleDiscountLive: boolean): boolean {
  return bottleDiscountLive && state.addBottle && state.purchaseType === "onetime" && state.qty === 2 && !state.customQtyOpen;
}

/** The cart lines this selection means. One-time lines never carry a frequency. */
export function purchaseLines(state: PurchaseState, bottleDiscountLive: boolean): PurchaseLine[] {
  const pouch: PurchaseLine = { slug: state.flavor, quantity: state.qty };
  if (state.purchaseType === "subscribe") pouch.subscriptionFrequency = state.frequency;
  const lines = [pouch];
  if (bottleIncluded(state, bottleDiscountLive)) lines.push({ slug: "bottle", quantity: 1 });
  return lines;
}

/**
 * Validate a selection restored from storage. Returns null for anything that is
 * not a well-formed selection, so corrupt or stale data can never reach the cart.
 * `lockedFlavor` is the flavor of a single-flavor product page.
 */
export function normalizeState(raw: unknown, lockedFlavor?: PurchaseFlavor): PurchaseState | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const flavor = lockedFlavor ?? r.flavor;
  if (flavor !== "strawberry-lemonade" && flavor !== "grapefruit") return null;
  if (r.purchaseType !== "subscribe" && r.purchaseType !== "onetime") return null;
  if (typeof r.qty !== "number" || !Number.isInteger(r.qty) || r.qty < 1 || r.qty > MAX_PURCHASE_QTY) return null;
  if (typeof r.frequency !== "number" || !(SUBSCRIPTION_FREQUENCIES as readonly number[]).includes(r.frequency)) return null;
  return {
    flavor,
    purchaseType: r.purchaseType,
    frequency: r.frequency,
    qty: r.qty,
    customQtyOpen: r.customQtyOpen === true,
    addBottle: r.addBottle === true,
  };
}
