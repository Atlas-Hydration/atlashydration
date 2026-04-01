"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
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
  subscriptionFrequency?: number; // weeks, if subscription
}

interface CartContextValue {
  items: CartItem[];
  cartCount: number;
  isCartOpen: boolean;
  checkoutUrl: string | null;
  addToCart: (productSlug: string, qty?: number, subscriptionFrequency?: number) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, qty: number) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  checkout: () => void;
}

// ---------------------------------------------------------------------------
// Shopify SDK type stubs (loaded from CDN at runtime)
// ---------------------------------------------------------------------------

interface ShopifyCheckout {
  id: string;
  webUrl: string;
  completedAt: string | null;
  lineItems: Array<{
    id: string;
    title: string;
    quantity: number;
    variant: {
      title: string;
      price: { amount: string } | string;
      image?: { src: string };
    };
  }>;
}

interface ShopifyClient {
  checkout: {
    create: () => Promise<ShopifyCheckout>;
    fetch: (id: string) => Promise<ShopifyCheckout>;
    addLineItems: (
      checkoutId: string,
      lineItems: Array<{ variantId: string; quantity: number }>
    ) => Promise<ShopifyCheckout>;
    removeLineItems: (
      checkoutId: string,
      lineItemIds: string[]
    ) => Promise<ShopifyCheckout>;
    updateLineItems: (
      checkoutId: string,
      lineItems: Array<{ id: string; quantity: number }>
    ) => Promise<ShopifyCheckout>;
  };
}

interface ShopifyBuySDK {
  buildClient: (config: {
    domain: string;
    storefrontAccessToken: string;
  }) => ShopifyClient;
}

declare global {
  interface Window {
    ShopifyBuy?: ShopifyBuySDK;
  }
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SHOPIFY_DOMAIN = "7fa7b7-42.myshopify.com";
const STOREFRONT_TOKEN = "390caf7f28b55c8958daeab3fcd55f76";
const SDK_URL =
  "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";
const STORAGE_CART_KEY = "atlas_cart";
const STORAGE_CHECKOUT_KEY = "atlas_checkout_id";

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

// ---------------------------------------------------------------------------
// Helper: read local cart from localStorage
// ---------------------------------------------------------------------------

function loadLocalCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_CART_KEY);
    if (saved) return JSON.parse(saved) as CartItem[];
  } catch {
    // ignore
  }
  return [];
}

function saveLocalCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(items));
  } catch {
    // quota exceeded or private browsing
  }
}

// ---------------------------------------------------------------------------
// Helper: map Shopify checkout line items to CartItem[]
// ---------------------------------------------------------------------------

function checkoutToItems(co: ShopifyCheckout): CartItem[] {
  return co.lineItems.map((li) => {
    const variantPrice =
      typeof li.variant.price === "string"
        ? parseFloat(li.variant.price)
        : parseFloat(li.variant.price.amount);

    let image: string | null = li.variant.image?.src ?? null;

    // Fallback to product data images
    if (!image) {
      for (const slug of Object.keys(PRODUCTS)) {
        if (
          li.title.toLowerCase().includes(slug.replace(/-/g, " "))
        ) {
          image = PRODUCTS[slug].images[0] ?? null;
          break;
        }
      }
    }

    const variantSuffix =
      li.variant.title !== "Default Title" ? ` — ${li.variant.title}` : "";

    return {
      slug: "",
      title: `${li.title}${variantSuffix}`,
      price: variantPrice,
      quantity: li.quantity,
      image,
    };
  });
}

// ---------------------------------------------------------------------------
// Buy 3 Get 1 Free promo calculation
// ---------------------------------------------------------------------------

function computePromo(items: CartItem[]) {
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
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const clientRef = useRef<ShopifyClient | null>(null);
  const checkoutRef = useRef<ShopifyCheckout | null>(null);
  // Track subscription selections per variant so we can restore after Shopify sync
  const subscriptionMetaRef = useRef<Record<string, number>>({}); // variantId -> frequency

  // -----------------------------------------------------------------------
  // Sync items from Shopify checkout object
  // -----------------------------------------------------------------------
  const syncFromCheckout = useCallback((co: ShopifyCheckout) => {
    checkoutRef.current = co;
    setCheckoutUrl(co.webUrl);
    try { localStorage.setItem(STORAGE_CHECKOUT_KEY, co.id); } catch { /* ignore */ }
    const cartItems = checkoutToItems(co);
    // Merge subscription metadata back into items
    const meta = subscriptionMetaRef.current;
    for (const item of cartItems) {
      // Match by looking up variant IDs from our product data
      for (const slug of Object.keys(PRODUCTS)) {
        const product = PRODUCTS[slug];
        if (meta[product.variantId] && item.title.toLowerCase().includes(product.name.toLowerCase())) {
          item.subscriptionFrequency = meta[product.variantId];
          item.price = product.subscribePrice;
          break;
        }
      }
    }
    setItems(cartItems);
  }, []);

  // -----------------------------------------------------------------------
  // Load Shopify Buy SDK from CDN
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    function initClient() {
      if (!window.ShopifyBuy) return;

      try {
        const client = window.ShopifyBuy.buildClient({
          domain: SHOPIFY_DOMAIN,
          storefrontAccessToken: STOREFRONT_TOKEN,
        });
        clientRef.current = client;

        const savedId = localStorage.getItem(STORAGE_CHECKOUT_KEY);
        if (savedId) {
          client.checkout
            .fetch(savedId)
            .then((existing) => {
              if (existing && !existing.completedAt) {
                syncFromCheckout(existing);
              } else {
                createNewCheckout(client);
              }
            })
            .catch(() => {
              clientRef.current = null;
              setItems(loadLocalCartFromStorage());
            });
        } else {
          createNewCheckout(client);
        }
      } catch {
        clientRef.current = null;
        setItems(loadLocalCartFromStorage());
      }
    }

    function createNewCheckout(client: ShopifyClient) {
      client.checkout
        .create()
        .then((co) => syncFromCheckout(co))
        .catch(() => {
          clientRef.current = null;
          setItems(loadLocalCartFromStorage());
        });
    }

    if (window.ShopifyBuy) {
      initClient();
      return;
    }

    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = initClient;
    script.onerror = () => {
      setItems(loadLocalCartFromStorage());
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [syncFromCheckout]);

  // -----------------------------------------------------------------------
  // Cart count (total quantity)
  // -----------------------------------------------------------------------
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  // -----------------------------------------------------------------------
  // addToCart
  // -----------------------------------------------------------------------
  const addToCart = useCallback(
    (productSlug: string, qty = 1, subscriptionFrequency?: number) => {
      const product = PRODUCTS[productSlug];
      if (!product) return;

      const client = clientRef.current;
      const co = checkoutRef.current;

      // Store subscription metadata so it survives Shopify sync
      if (subscriptionFrequency) {
        subscriptionMetaRef.current[product.variantId] = subscriptionFrequency;
      } else {
        delete subscriptionMetaRef.current[product.variantId];
      }

      if (client && co) {
        const lineItems = [{ variantId: product.variantId, quantity: qty }];
        client.checkout
          .addLineItems(co.id, lineItems)
          .then((updated) => {
            syncFromCheckout(updated);
            setIsCartOpen(true);
          })
          .catch(() => {
            addToLocalCart(productSlug, qty, subscriptionFrequency);
          });
      } else {
        addToLocalCart(productSlug, qty, subscriptionFrequency);
      }
    },
    [syncFromCheckout]
  );

  function addToLocalCart(slug: string, qty: number, subscriptionFrequency?: number) {
    setItems((prev) => {
      const existing = prev.findIndex((i) => i.slug === slug && i.subscriptionFrequency === subscriptionFrequency);
      let next: CartItem[];

      if (existing >= 0) {
        next = prev.map((item, idx) =>
          idx === existing
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      } else {
        const product = PRODUCTS[slug];
        const price = subscriptionFrequency ? 23.99 : product.price;
        next = [
          ...prev,
          {
            slug,
            title: `${product.name} — 16 Pack`,
            price,
            quantity: qty,
            image: product.images[0] ?? null,
            subscriptionFrequency,
          },
        ];
      }

      saveLocalCart(next);
      return next;
    });
    setIsCartOpen(true);
  }

  // -----------------------------------------------------------------------
  // removeFromCart
  // -----------------------------------------------------------------------
  const removeFromCart = useCallback(
    (index: number) => {
      const client = clientRef.current;
      const co = checkoutRef.current;

      if (client && co && co.lineItems[index]) {
        const lineItemId = co.lineItems[index].id;
        client.checkout
          .removeLineItems(co.id, [lineItemId])
          .then((updated) => syncFromCheckout(updated));
      } else {
        setItems((prev) => {
          const next = prev.filter((_, i) => i !== index);
          saveLocalCart(next);
          return next;
        });
      }
    },
    [syncFromCheckout]
  );

  // -----------------------------------------------------------------------
  // updateQuantity
  // -----------------------------------------------------------------------
  const updateQuantity = useCallback(
    (index: number, qty: number) => {
      if (qty < 1) {
        removeFromCart(index);
        return;
      }

      const client = clientRef.current;
      const co = checkoutRef.current;

      if (client && co && co.lineItems[index]) {
        const lineItemId = co.lineItems[index].id;
        client.checkout
          .updateLineItems(co.id, [{ id: lineItemId, quantity: qty }])
          .then((updated) => syncFromCheckout(updated));
      } else {
        setItems((prev) => {
          const next = prev.map((item, i) =>
            i === index ? { ...item, quantity: qty } : item
          );
          saveLocalCart(next);
          return next;
        });
      }
    },
    [removeFromCart, syncFromCheckout]
  );

  // -----------------------------------------------------------------------
  // open / close / toggle
  // -----------------------------------------------------------------------
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  // -----------------------------------------------------------------------
  // checkout
  // -----------------------------------------------------------------------
  const checkout = useCallback(() => {
    const hasSubscriptions = items.some((i) => i.subscriptionFrequency);

    // If any item has a subscription, build a /cart/ URL with selling plan IDs
    // so Appstle can create the subscription at checkout.
    // Also use this path as fallback when Shopify SDK checkout isn't available.
    if (items.length > 0) {
      const co = checkoutRef.current;

      // Use Shopify SDK checkout only if no subscriptions
      if (!hasSubscriptions && co && co.webUrl) {
        window.location.href = co.webUrl;
        return;
      }

      // Build /cart/ URL with optional selling plan IDs
      const parts = items
        .map((item) => {
          const product = PRODUCTS[item.slug];
          if (!product) return null;
          const numericId = product.variantId.replace(
            "gid://shopify/ProductVariant/",
            ""
          );
          // Format: variantId:quantity:sellingPlanId (selling plan is optional)
          if (item.subscriptionFrequency && SELLING_PLANS[item.subscriptionFrequency]) {
            return `${numericId}:${item.quantity}:${SELLING_PLANS[item.subscriptionFrequency]}`;
          }
          return `${numericId}:${item.quantity}`;
        })
        .filter(Boolean);

      if (parts.length > 0) {
        window.location.href = `https://${SHOPIFY_DOMAIN}/cart/${parts.join(",")}`;
      } else {
        window.location.href = `https://${SHOPIFY_DOMAIN}`;
      }
    }
  }, [items]);

  // -----------------------------------------------------------------------
  // Escape key closes cart
  // -----------------------------------------------------------------------
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isCartOpen) {
        setIsCartOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen]);

  // -----------------------------------------------------------------------
  // Value
  // -----------------------------------------------------------------------
  const value: CartContextValue = {
    items,
    cartCount,
    isCartOpen,
    checkoutUrl,
    addToCart,
    removeFromCart,
    updateQuantity,
    openCart,
    closeCart,
    toggleCart,
    checkout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a <CartProvider>");
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Re-export promo helper for use in cart UI components
// ---------------------------------------------------------------------------

export { computePromo };
