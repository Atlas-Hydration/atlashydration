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
// Buy 3 Get 1 Free promo calculation
// ---------------------------------------------------------------------------

function computePromo(items: CartItem[]) {
  // Bundle discounts handled by Shopify discount codes
  if (typeof window !== 'undefined' && localStorage.getItem('atlas_discount_code')) {
    return { freeItems: 0, discount: 0 };
  }
  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  const freeItems = Math.floor(totalQty / 3);
  let discount = 0;
  if (freeItems > 0 && items.length > 0) {
    const cheapest = Math.min(...items.map((i) => i.price));
    discount = cheapest * freeItems;
  }
  return { freeItems, discount };
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

      // GA4 tracking
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).gtag('event', 'add_to_cart', {
          currency: 'USD',
          value: (subscriptionFrequency ? product.subscribePrice : product.price) * qty,
          items: [{ item_id: productSlug, item_name: product.name, quantity: qty, price: subscriptionFrequency ? product.subscribePrice : product.price }],
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
          const price = subscriptionFrequency ? product.subscribePrice : product.price;
          next = [
            ...prev,
            {
              slug: productSlug,
              title: `${product.name} — 16 Pack`,
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
  // checkout — redirect to Shopify /cart/ permalink
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

    // Build cart permalink parts: variant_id:quantity
    const cartParts: string[] = [];
    let sellingPlanId = '';

    for (const item of items) {
      const product = PRODUCTS[item.slug];
      if (!product) continue;
      const variantNum = product.variantId.replace('gid://shopify/ProductVariant/', '');
      cartParts.push(`${variantNum}:${item.quantity}`);
      if (item.subscriptionFrequency && SELLING_PLANS[item.subscriptionFrequency]) {
        sellingPlanId = SELLING_PLANS[item.subscriptionFrequency];
      }
    }

    if (cartParts.length === 0) return;

    // Build URL with selling_plan and discount params
    let url = `https://${SHOPIFY_DOMAIN}/cart/${cartParts.join(',')}`;
    const params = new URLSearchParams();
    if (sellingPlanId) params.set('selling_plan', sellingPlanId);

    const discountCode = localStorage.getItem('atlas_discount_code');
    if (discountCode) {
      params.set('discount', discountCode);
      localStorage.removeItem('atlas_discount_code');
    }

    const qs = params.toString();
    if (qs) url += `?${qs}`;

    console.log('[Atlas Checkout]', url);
    window.location.href = url;
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

export { computePromo };
