"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { PRODUCTS } from "@/app/data/products";

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
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

// ---------------------------------------------------------------------------
// Bottle discount tiers, purely a function of qualifying pouch quantity:
// 2 pouches -> bottle 50% off, 4 pouches -> bottle free. Both are meant to be
// real Shopify "Buy X Get Y" automatic discounts (no code), so the tier here
// only ever describes/displays the expected discount — it never overrides
// the bottle's actual line-item price, which always stays its real $19.99.
// ---------------------------------------------------------------------------

const QUALIFYING_POUCH_SLUGS = ["strawberry-lemonade", "grapefruit"];
export const BOTTLE_HALF_OFF_THRESHOLD = 2;
export const BOTTLE_FREE_THRESHOLD = 4;
export const BOTTLE_FULL_PRICE = 19.99;
export const BOTTLE_HALF_PRICE = 9.99;

export type BottleTier = "none" | "half" | "free";

function computeBottlePromo(items: CartItem[]) {
  const qualifyingQty = items.reduce(
    (sum, i) => (QUALIFYING_POUCH_SLUGS.includes(i.slug) ? sum + i.quantity : sum),
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
// Discount code — derived fresh from actual cart contents every time, rather
// than tracked as click-state, so it can never go stale or get silently
// wiped by an unrelated "Add to Cart" click elsewhere. Only the 2-pouch
// same-flavor bundle still uses a coupon code; the bottle tiers above rely
// on Shopify's own automatic discounts, not a code.
// ---------------------------------------------------------------------------

export const TWO_PACK_DISCOUNT_AMOUNT = 4.99;

function findTwoPack(items: CartItem[]) {
  return items.find(
    (i) => QUALIFYING_POUCH_SLUGS.includes(i.slug) && i.quantity === 2 && !i.subscriptionFrequency
  );
}

function deriveDiscountCode(items: CartItem[]): string {
  return findTwoPack(items) ? "ATLAS2PACK" : "";
}

// Real dollar amount of the 2-pack discount, so the cart total can reflect
// it immediately rather than only after Shopify applies the code at checkout.
function computeTwoPackDiscount(items: CartItem[]): number {
  return findTwoPack(items) ? TWO_PACK_DISCOUNT_AMOUNT : 0;
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

    // Apply discount code, derived fresh from what's actually in the cart
    const discountCode = deriveDiscountCode(items);
    if (discountCode) {
      const discountField = document.createElement('input');
      discountField.type = 'hidden';
      discountField.name = 'discount';
      discountField.value = discountCode;
      form.appendChild(discountField);
    }

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

export { computeBottlePromo, deriveDiscountCode, computeTwoPackDiscount };
