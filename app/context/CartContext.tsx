"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { trackMeta } from "@/app/lib/metaPixel";
import { ensureFourPouchBundle } from "@/app/lib/fourPouchBundle";
import { PRODUCTS } from "@/app/data/products";
import { BOTTLE_RETAIL, BOTTLE_HALF_PRICE as BOTTLE_HALF_PRICE_CALC, multiPouchDiscount } from "@/app/data/pricing";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CartItem {
  slug: string;
  title: string;
  price: number;
  quantity: number;
  image: string | null;
  subscriptionFrequency?: number;
}

interface CartContextValue {
  items: CartItem[];
  cartCount: number;
  isCartOpen: boolean;
  addToCart: (productSlug: string, qty?: number, subscriptionFrequency?: number) => void;
  addFourPouchBundle: () => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, qty: number) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  checkout: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SHOPIFY_DOMAIN = "7fa7b7-42.myshopify.com";
const STORAGE_CART_KEY = "atlas_cart";

// Appstle selling plan IDs (mapped by delivery frequency in weeks)
const SELLING_PLANS: Record<number, string> = {
  2: "4014735434",
  4: "4014768202",
  6: "4014800970",
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const CartContext = createContext<CartContextValue | null>(null);

function saveCart(items: CartItem[]) {
  try { localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(items)); } catch { /* */ }
}

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_CART_KEY);
    const saved: CartItem[] = raw ? JSON.parse(raw) : [];
    // A cart saved before a price change must not keep showing the old price:
    // re-price every line from the current catalog.
    return saved.map((item) => {
      const product = PRODUCTS[item.slug];
      if (!product) return item;
      return { ...item, price: item.subscriptionFrequency ? product.subscribePrice : product.price };
    });
  } catch { return []; }
}

// ---------------------------------------------------------------------------
// Bottle discount tiers, purely a function of qualifying pouch quantity:
// 2 pouches -> bottle 50% off, 4 pouches -> bottle free.
//
// These are only TRUE if Shopify has a matching automatic discount (Buy 2
// pouches get the bottle 50% off, Buy 4 get it free, set to combine with
// product discounts so it coexists with ATLAS2PACK). A live checkout on
// 2026-08-27 (#134) showed the site promising this while Shopify charged full
// price. BOTTLE_DISCOUNT_LIVE gates every place that asserts a bottle discount
// (slider, cart total, item tag, promo card, bundle price, announcement bar,
// hints). If a checkout ever shows the bottle at full price, set it to false.
// Verify with docs/PRICING.md rows 9, 10 and 10b.
// ---------------------------------------------------------------------------

export const BOTTLE_DISCOUNT_LIVE = true;

const QUALIFYING_POUCH_SLUGS = ["strawberry-lemonade", "grapefruit"];
export const BOTTLE_HALF_OFF_THRESHOLD = 2;
export const BOTTLE_FREE_THRESHOLD = 4;
export const BOTTLE_FULL_PRICE = BOTTLE_RETAIL;
export const BOTTLE_HALF_PRICE = BOTTLE_HALF_PRICE_CALC;

export type BottleTier = "none" | "half" | "free";

function computeBottlePromo(items: CartItem[]) {
  // Both Shopify bottle discounts are set to "One-time purchase", so only
  // one-time pouches count toward the tiers (subscription pouches do not).
  const qualifyingQty = items.reduce(
    (sum, i) => (QUALIFYING_POUCH_SLUGS.includes(i.slug) && !i.subscriptionFrequency ? sum + i.quantity : sum),
    0
  );
  const bottleInCart = items.some((i) => i.slug === "bottle" && i.quantity > 0);

  const tier: BottleTier =
    qualifyingQty >= BOTTLE_FREE_THRESHOLD ? "free"
    : qualifyingQty >= BOTTLE_HALF_OFF_THRESHOLD ? "half"
    : "none";

  const remainingToNextTier =
    tier === "free" ? 0
    : tier === "half" ? BOTTLE_FREE_THRESHOLD - qualifyingQty
    : BOTTLE_HALF_OFF_THRESHOLD - qualifyingQty;

  return { qualifyingQty, bottleInCart, tier, remainingToNextTier };
}

// ---------------------------------------------------------------------------
// Expected cart totals. Shopify checkout is authoritative; this only mirrors
// what it really charges:
//   - ATLAS2PACK (automatic): $2.50 off each one-time pouch, 2+ pouches.
//   - Bottle tiers (automatic Buy X Get Y): 50% off at 2 one-time pouches,
//     free at 4. Only while BOTTLE_DISCOUNT_LIVE.
//   - Shopify will NOT apply ATLAS2PACK and a bottle discount on the same
//     order (live checkout 2026-09-30: 2 pouches alone got ATLAS2PACK -$5.00,
//     2 pouches + bottle got only the bottle -$9.99). It gives the customer the
//     larger one, so the cart shows only the larger one too.
//   - Subscription pouches are already priced at 20% off and never count toward
//     ATLAS2PACK or the bottle tiers.
// ---------------------------------------------------------------------------

function computeCartPricing(items: CartItem[]) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const oneTimePouchQty = items.reduce(
    (sum, i) => (QUALIFYING_POUCH_SLUGS.includes(i.slug) && !i.subscriptionFrequency ? sum + i.quantity : sum),
    0
  );
  const pouchOffer = multiPouchDiscount(oneTimePouchQty);

  const { bottleInCart, tier } = computeBottlePromo(items);
  const bottleOffer =
    !BOTTLE_DISCOUNT_LIVE || !bottleInCart ? 0
    : tier === "free" ? BOTTLE_FULL_PRICE
    : tier === "half" ? Math.round((BOTTLE_FULL_PRICE - BOTTLE_HALF_PRICE) * 100) / 100
    : 0;

  // One discount wins, never both.
  const bottleWins = bottleOffer > 0 && bottleOffer >= pouchOffer;
  const bottleDiscount = bottleWins ? bottleOffer : 0;
  const pouchDiscount = bottleWins ? 0 : pouchOffer;

  const total = Math.round((subtotal - pouchDiscount - bottleDiscount) * 100) / 100;
  return { subtotal, oneTimePouchQty, pouchDiscount, bottleDiscount, total };
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setItems(loadCart());
  }, []);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  // -----------------------------------------------------------------------
  // addToCart
  // -----------------------------------------------------------------------
  const addToCart = useCallback(
    (productSlug: string, qty = 1, subscriptionFrequency?: number) => {
      const product = PRODUCTS[productSlug];
      if (!product) return;

      const price = subscriptionFrequency ? product.subscribePrice : product.price;

      trackMeta("AddToCart", {
        content_ids: [product.variantId.replace("gid://shopify/ProductVariant/", "")],
        content_type: "product", currency: "USD", value: price * qty,
        contents: [{ id: product.variantId.replace("gid://shopify/ProductVariant/", ""), quantity: qty }],
      });

      // GA4 tracking
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).gtag('event', 'add_to_cart', {
          currency: 'USD',
          value: price * qty,
          items: [{ item_id: productSlug, item_name: product.name, quantity: qty, price }],
        });
      }

      setItems((prev) => {
        const existing = prev.findIndex((i) => i.slug === productSlug && i.subscriptionFrequency === subscriptionFrequency);
        let next: CartItem[];

        if (existing >= 0) {
          next = prev.map((item, idx) =>
            idx === existing ? { ...item, quantity: item.quantity + qty } : item
          );
        } else {
          next = [
            ...prev,
            {
              slug: productSlug,
              title: product.packLabel ? `${product.name} — ${product.packLabel}` : product.name,
              price,
              quantity: qty,
              image: product.images[0] ?? null,
              subscriptionFrequency,
            },
          ];
        }

        saveCart(next);
        return next;
      });
      setIsCartOpen(true);
    },
    []
  );

  const addFourPouchBundle = useCallback(() => {
    if (!BOTTLE_DISCOUNT_LIVE) return;
    const next = ensureFourPouchBundle(items);
    const additions = next.map((line) => ({
      ...line,
      quantity: line.quantity - (items.find((item) => item.slug === line.slug && item.subscriptionFrequency === line.subscriptionFrequency)?.quantity ?? 0),
    })).filter((line) => line.quantity > 0);
    if (additions.length) {
      trackMeta("AddToCart", {
        content_ids: additions.map((line) => PRODUCTS[line.slug].variantId.replace("gid://shopify/ProductVariant/", "")),
        content_type: "product", currency: "USD",
        value: Math.max(0, computeCartPricing(next).total - computeCartPricing(items).total),
        contents: additions.map((line) => ({ id: PRODUCTS[line.slug].variantId.replace("gid://shopify/ProductVariant/", ""), quantity: line.quantity })),
      });
      setItems((previous) => {
        const updated = ensureFourPouchBundle(previous);
        saveCart(updated);
        return updated;
      });
    }
    setIsCartOpen(true);
  }, [items]);

  // -----------------------------------------------------------------------
  // removeFromCart
  // -----------------------------------------------------------------------
  const removeFromCart = useCallback((index: number) => {
    setItems((prev) => {
      const next = prev.filter((_, i) => i !== index);
      saveCart(next);
      return next;
    });
  }, []);

  // -----------------------------------------------------------------------
  // updateQuantity
  // -----------------------------------------------------------------------
  const updateQuantity = useCallback((index: number, qty: number) => {
    if (qty < 1) {
      removeFromCart(index);
      return;
    }
    setItems((prev) => {
      const next = prev.map((item, i) => (i === index ? { ...item, quantity: qty } : item));
      saveCart(next);
      return next;
    });
  }, [removeFromCart]);

  // -----------------------------------------------------------------------
  // checkout — POST hidden form to Shopify /cart/add then redirect to /checkout
  // This creates a real Shopify cart session with selling_plan attached,
  // then sends the user to standard Shopify checkout (not Shop Pay).
  // -----------------------------------------------------------------------
  const checkout = useCallback(() => {
    if (items.length === 0) return;

    // GA4 tracking
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: total,
        items: items.map((i) => ({ item_id: i.slug, item_name: i.title, quantity: i.quantity, price: i.price })),
      });
    }

    trackMeta("InitiateCheckout", {
      content_ids: items.filter((item) => PRODUCTS[item.slug]).map((item) => PRODUCTS[item.slug].variantId.replace("gid://shopify/ProductVariant/", "")),
      content_type: "product", currency: "USD", value: computeCartPricing(items).total,
      num_items: items.reduce((sum, item) => sum + item.quantity, 0),
    });

    // Build a hidden form that POSTs to Shopify's /cart endpoint
    // This is the standard way headless stores add items with selling plans
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `https://${SHOPIFY_DOMAIN}/cart/add`;
    form.style.display = 'none';

    // Add each cart item as form fields
    // Shopify /cart/add accepts: id, quantity, selling_plan
    // For multiple items we need to use the items[] format
    let itemIndex = 0;
    for (const item of items) {
      const product = PRODUCTS[item.slug];
      if (!product) continue;
      const variantNum = product.variantId.replace('gid://shopify/ProductVariant/', '');

      const addField = (name: string, value: string) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };

      addField(`items[${itemIndex}][id]`, variantNum);
      addField(`items[${itemIndex}][quantity]`, String(item.quantity));

      if (item.subscriptionFrequency && SELLING_PLANS[item.subscriptionFrequency]) {
        addField(`items[${itemIndex}][selling_plan]`, SELLING_PLANS[item.subscriptionFrequency]);
      }

      itemIndex++;
    }

    // Tell Shopify to redirect to checkout after adding
    const returnField = document.createElement('input');
    returnField.type = 'hidden';
    returnField.name = 'return_to';
    returnField.value = '/checkout';
    form.appendChild(returnField);

    // No discount code is sent: ATLAS2PACK is an automatic Shopify discount, and
    // any customer code (e.g. the welcome code) is entered by the customer at checkout.

    console.log('[Atlas Checkout] Submitting form to /cart/add with return_to=/checkout');
    document.body.appendChild(form);
    form.submit();
  }, [items]);

  // -----------------------------------------------------------------------
  // Cart open/close/toggle
  // -----------------------------------------------------------------------
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((o) => !o), []);

  // Escape key closes cart
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isCartOpen) setIsCartOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen]);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        isCartOpen,
        addToCart,
        addFourPouchBundle,
        removeFromCart,
        updateQuantity,
        openCart,
        closeCart,
        toggleCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export { computeBottlePromo, computeCartPricing };
