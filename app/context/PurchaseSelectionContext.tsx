"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import { useCart, BOTTLE_DISCOUNT_LIVE, computeCartPricing } from "@/app/context/CartContext";
import { oneTimePouchTotal } from "@/app/data/pricing";
import { PRODUCTS } from "@/app/data/products";
import {
  offerState,
  purchaseLines,
  bottleIncluded as isBottleIncluded,
  DEFAULT_OFFER,
  type OfferId,
  type PurchaseFlavor,
  type PurchaseState,
  type PurchaseType,
} from "@/app/data/purchase";
import { readSelection, shouldRestoreSelection, writeSelection } from "@/app/lib/selectionMemory";

export type { PurchaseFlavor, PurchaseType, OfferId } from "@/app/data/purchase";

/**
 * The offer the shopper has picked (flavor, how to buy, quantity, subscription
 * frequency, bottle add-on) and the ONE routine that adds it to the cart. Every
 * add-to-cart button on the page (buy box, sticky bar, bottom Order button) reads
 * from here, so none can add something different from what is selected.
 */
interface PurchaseSelection {
  flavor: PurchaseFlavor;
  setFlavor: (flavor: PurchaseFlavor) => void;
  purchaseType: PurchaseType;
  setPurchaseType: (type: PurchaseType) => void;
  frequency: number;
  setFrequency: (weeks: number) => void;
  qty: number;
  setQty: (qty: number) => void;
  customQtyOpen: boolean;
  setCustomQtyOpen: (open: boolean) => void;
  addBottle: boolean;
  setAddBottle: (add: boolean) => void;

  isPreorder: boolean;
  isSubscribing: boolean;
  /** True when the optional bottle add-on is checked AND currently offered. */
  bottleIncluded: boolean;
  /** Expected cart total for the selection, priced like the cart and Shopify. */
  total: number;
  /** Short description of the selection, e.g. "2 pouches + bottle". */
  offerLabel: string;
  /** True for a moment after an add, while repeat clicks are ignored. */
  adding: boolean;
  /** Adds the selection. Resolves false when ignored as an accidental repeat click. */
  addSelectionToCart: () => Promise<boolean>;
}

const PurchaseSelectionContext = createContext<PurchaseSelection | null>(null);

/** Identical repeat adds inside this window are ignored (double-clicks). */
const REPEAT_ADD_WINDOW_MS = 1200;

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function PurchaseSelectionProvider({
  children,
  initialFlavor = "strawberry-lemonade",
  initialOffer = DEFAULT_OFFER,
  lockFlavor = false,
}: {
  children: ReactNode;
  initialFlavor?: PurchaseFlavor;
  /** The offer selected on first render (and on every fresh visit). */
  initialOffer?: OfferId;
  /** Single-flavor product pages: a remembered selection can never change the flavor. */
  lockFlavor?: boolean;
}) {
  const { addLines } = useCart();
  const [state, setState] = useState<PurchaseState>(() => offerState(initialOffer, initialFlavor));
  const [adding, setAdding] = useState(false);
  const restoredRef = useRef(false);
  const lastAdd = useRef<{ sig: string; at: number } | null>(null);
  const addingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // After a reload or a Back/Forward move, bring back what the shopper had picked.
  // Fresh visits keep the offer named by the page (see selectionMemory.ts).
  useIsomorphicLayoutEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    if (!shouldRestoreSelection()) return;
    const saved = readSelection(window.location.pathname, lockFlavor ? initialFlavor : undefined);
    if (saved) setState(saved);
  }, [initialFlavor, lockFlavor]);

  useEffect(() => {
    if (restoredRef.current) writeSelection(window.location.pathname, state);
  }, [state]);

  useEffect(() => () => { if (addingTimer.current) clearTimeout(addingTimer.current); }, []);

  const patch = useCallback((p: Partial<PurchaseState>) => setState((s) => ({ ...s, ...p })), []);
  const setFlavor = useCallback((flavor: PurchaseFlavor) => patch({ flavor }), [patch]);
  const setPurchaseType = useCallback((purchaseType: PurchaseType) => patch({ purchaseType }), [patch]);
  const setFrequency = useCallback((frequency: number) => patch({ frequency }), [patch]);
  const setQty = useCallback((qty: number) => patch({ qty }), [patch]);
  const setCustomQtyOpen = useCallback((customQtyOpen: boolean) => patch({ customQtyOpen }), [patch]);
  const setAddBottle = useCallback((addBottle: boolean) => patch({ addBottle }), [patch]);

  const { flavor, purchaseType, frequency, qty, customQtyOpen, addBottle } = state;
  const product = PRODUCTS[flavor];
  const isPreorder = flavor === "grapefruit";
  const isSubscribing = purchaseType === "subscribe";
  const bottleIncluded = isBottleIncluded(state, BOTTLE_DISCOUNT_LIVE);

  // The multi-pouch discount only applies to one-time purchases; a subscription
  // already carries its own 20% discount.
  const pouchTotal = isSubscribing ? qty * product.subscribePrice : oneTimePouchTotal(qty);
  const total = bottleIncluded
    ? computeCartPricing([
        { slug: flavor, title: product.name, price: product.price, quantity: 2, image: null },
        { slug: "bottle", title: PRODUCTS.bottle.name, price: PRODUCTS.bottle.price, quantity: 1, image: null },
      ]).total
    : pouchTotal;

  const pouches = qty === 1 ? "1 pouch" : `${qty} pouches`;
  const offerLabel = isSubscribing
    ? qty === 1 ? "Subscribe & Save" : `Subscribe · ${pouches}`
    : `${pouches}${bottleIncluded ? " + bottle" : ""}`;

  const addSelectionToCart = useCallback(async () => {
    const lines = purchaseLines(state, BOTTLE_DISCOUNT_LIVE);
    const sig = JSON.stringify(lines);
    const now = Date.now();
    // A double-click (or key repeat) must not add the same selection twice. A
    // different selection, or the same one after the window, is a real choice.
    if (lastAdd.current && lastAdd.current.sig === sig && now - lastAdd.current.at < REPEAT_ADD_WINDOW_MS) return false;
    lastAdd.current = { sig, at: now };

    addLines(lines);
    setAdding(true);
    if (addingTimer.current) clearTimeout(addingTimer.current);
    addingTimer.current = setTimeout(() => setAdding(false), REPEAT_ADD_WINDOW_MS);
    return true;
  }, [state, addLines]);

  return (
    <PurchaseSelectionContext.Provider
      value={{
        flavor, setFlavor,
        purchaseType, setPurchaseType,
        frequency, setFrequency,
        qty, setQty,
        customQtyOpen, setCustomQtyOpen,
        addBottle, setAddBottle,
        isPreorder, isSubscribing, bottleIncluded, total, offerLabel,
        adding, addSelectionToCart,
      }}
    >
      {children}
    </PurchaseSelectionContext.Provider>
  );
}

export function usePurchaseSelection() {
  const ctx = useContext(PurchaseSelectionContext);
  if (!ctx) throw new Error("usePurchaseSelection must be used within a PurchaseSelectionProvider");
  return ctx;
}
