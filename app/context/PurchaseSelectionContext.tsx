"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useCart, BOTTLE_DISCOUNT_LIVE, computeCartPricing } from "@/app/context/CartContext";
import { oneTimePouchTotal } from "@/app/data/pricing";
import { PRODUCTS } from "@/app/data/products";
import type { PurchaseType } from "@/app/components/PurchaseOptions";

export type PurchaseFlavor = "strawberry-lemonade" | "grapefruit";

/**
 * The homepage offer the shopper has picked (flavor, how to buy, quantity,
 * subscription frequency, bottle add-on) and the ONE routine that adds it to the
 * cart. The main buy box, the sticky bar and the bottom Order button all read
 * from here, so they can never add something different from what is selected.
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
  addSelectionToCart: () => Promise<void>;
}

const PurchaseSelectionContext = createContext<PurchaseSelection | null>(null);

export function PurchaseSelectionProvider({ children }: { children: ReactNode }) {
  const { addToCart } = useCart();
  const [flavor, setFlavor] = useState<PurchaseFlavor>("strawberry-lemonade");
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("subscribe");
  const [frequency, setFrequency] = useState(2);
  const [qty, setQty] = useState(1);
  const [customQtyOpen, setCustomQtyOpen] = useState(false);
  const [addBottle, setAddBottle] = useState(false);

  const product = PRODUCTS[flavor];
  const isPreorder = flavor === "grapefruit";
  const isSubscribing = purchaseType === "subscribe";

  // The multi-pouch discount only applies to one-time purchases; a subscription
  // already carries its own 20% discount.
  const pouchTotal = isSubscribing ? qty * product.subscribePrice : oneTimePouchTotal(qty);

  // Optional Atlas Bottle add-on, only offered with the 2-pouch one-time option.
  const bottleIncluded = BOTTLE_DISCOUNT_LIVE && addBottle && !isSubscribing && qty === 2 && !customQtyOpen;
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
    await addToCart(flavor, qty, isSubscribing ? frequency : undefined);
    if (bottleIncluded) await addToCart("bottle", 1);
  }, [addToCart, flavor, qty, isSubscribing, frequency, bottleIncluded]);

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
        addSelectionToCart,
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
