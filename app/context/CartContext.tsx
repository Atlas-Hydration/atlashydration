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
  variantId?: string; // Shopify variant GID, used for subscription metadata matching
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
      id: string;
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
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || "390caf7f28b55c8958daeab3fcd55f76";
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

    // Try to recover slug from title
    let slug = "";
    for (const s of Object.keys(PRODUCTS)) {
      if (li.title.toLowerCase().includes(PRODUCTS[s].name.toLowerCase())) {
        slug = s;
        break;
      }
    }

    return {
      slug,
      title: `${li.title}${variantSuffix}`,
      price: variantPrice,
      quantity: li.quantity,
      image,
      variantId: li.variant.id,
    };
  });
}

// ---------------------------------------------------------------------------
// Buy 3 Get 1 Free promo calculation
// ---------------------------------------------------------------------------

function computePromo(items: CartItem[]) {
  // Bundle discounts are handled by Shopify discount codes (ATLAS2PACK, ATLAS3GET1)
  // Don't apply client-side discounts when a bundle code is active
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
    // Merge subscription metadata back into items using variant ID matching
    const meta = subscriptionMetaRef.current;
    for (const item of cartItems) {
      // Try direct match first
      let freq = item.variantId ? meta[item.variantId] : undefined;
      // Try decoding base64 variant ID (SDK returns base64-encoded GIDs)
      if (!freq && item.variantId) {
        try {
          const decoded = atob(item.variantId);
          freq = meta[decoded];
        } catch { /* not base64 */ }
      }
      // Try matching against known product variant GIDs
      if (!freq) {
        for (const slug of Object.keys(PRODUCTS)) {
          const p = PRODUCTS[slug];
          const numericId = p.variantId.split('/').pop();
          if (item.variantId && (item.variantId.includes(numericId!) || item.title.toLowerCase().includes(p.name.toLowerCase()))) {
            freq = meta[p.variantId];
            if (freq) { item.slug = slug; }
            break;
          }
        }
      }
      if (freq) {
        item.subscriptionFrequency = freq;
        for (const slug of Object.keys(PRODUCTS)) {
          if (PRODUCTS[slug].variantId === item.variantId || item.title.toLowerCase().includes(PRODUCTS[slug].name.toLowerCase())) {
            item.price = PRODUCTS[slug].subscribePrice;
            item.slug = slug;
            break;
          }
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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).gtag('event', 'add_to_cart', {
          currency: 'USD',
          value: (subscriptionFrequency ? 23.99 : 29.99) * qty,
          items: [{ item_id: productSlug, item_name: product.name, quantity: qty, price: subscriptionFrequency ? 23.99 : 29.99 }],
        });
      }

      const client = clientRef.current;
      const co = checkoutRef.current;

      // Store subscription metadata so it survives Shopify sync
      if (subscriptionFrequency) {
        subscriptionMetaRef.current[product.variantId] = subscriptionFrequency;
      } else {
        delete subscriptionMetaRef.current[product.variantId];
      }

      // For subscriptions, ALWAYS use local cart — the Buy SDK checkout
      // cannot carry selling plans and will strip them on sync
      if (subscriptionFrequency) {
        addToLocalCart(productSlug, qty, subscriptionFrequency);
        return;
      }

      if (clientRef.current && checkoutRef.current) {
        const lineItems = [{ variantId: product.variantId, quantity: qty }];
        clientRef.current.checkout
          .addLineItems(checkoutRef.current.id, lineItems)
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
  // checkout – uses Storefront API cartCreate so selling plans work from any domain
  // -----------------------------------------------------------------------
  const checkout = useCallback(async () => {
    if (items.length === 0) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      const total = items.reduce((s, i) => s + (i.subscriptionFrequency ? 23.99 : 29.99) * i.quantity, 0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: total,
        items: items.map((i) => ({ item_id: i.slug, item_name: i.title, quantity: i.quantity, price: i.subscriptionFrequency ? 23.99 : 29.99 })),
      });
    }

    // Read and clear discount code
    const discountCode = localStorage.getItem('atlas_discount_code');
    if (discountCode) localStorage.removeItem('atlas_discount_code');

    // Determine if any items have subscriptions
    const hasSubscriptions = items.some((i) => i.subscriptionFrequency);

    // For subscription carts, use Shopify /cart/ permalink with selling_plan
    // This is the most reliable method — cartCreate sometimes silently drops selling plans
    if (hasSubscriptions) {
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

      let url = `https://${SHOPIFY_DOMAIN}/cart/${cartParts.join(',')}`;
      const params = new URLSearchParams();
      if (sellingPlanId) params.set('selling_plan', sellingPlanId);
      if (discountCode) params.set('discount', discountCode);
      const qs = params.toString();
      if (qs) url += `?${qs}`;

      console.log('[Atlas Checkout] Subscription cart permalink:', url);
      window.location.href = url;
      return;
    }

    // For non-subscription carts, build lines for cartCreate
    const lines = items
      .map((item) => {
        let variantGid: string | null = null;

        // Try slug lookup first
        const product = PRODUCTS[item.slug];
        if (product) {
          variantGid = product.variantId;
        } else {
          // After Shopify SDK sync, slug is empty. Match by variantId or title.
          for (const slug of Object.keys(PRODUCTS)) {
            const p = PRODUCTS[slug];
            if (item.variantId && (item.variantId === p.variantId || item.variantId.includes(p.variantId.split("/").pop()!))) {
              variantGid = p.variantId;
              break;
            }
            if (item.title.toLowerCase().includes(p.name.toLowerCase())) {
              variantGid = p.variantId;
              break;
            }
          }
          // Last resort: use variantId directly or decode base64
          if (!variantGid && item.variantId) {
            try {
              const decoded = atob(item.variantId);
              variantGid = decoded.startsWith("gid://") ? decoded : `gid://shopify/ProductVariant/${decoded}`;
            } catch {
              variantGid = item.variantId.startsWith("gid://") ? item.variantId : `gid://shopify/ProductVariant/${item.variantId}`;
            }
          }
        }

        if (!variantGid) return null;

        return { merchandiseId: variantGid, quantity: item.quantity };
      })
      .filter(Boolean);

    if (lines.length === 0) return;

    console.log('[Atlas Checkout] Non-subscription cart lines:', JSON.stringify(lines, null, 2));

    // Use Storefront API cartCreate mutation
    const mutation = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const cartInput: { lines: typeof lines; discountCodes?: string[] } = { lines };
    if (discountCode) cartInput.discountCodes = [discountCode];

    try {
      const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-07/graphql.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
        },
        body: JSON.stringify({
          query: mutation,
          variables: { input: cartInput },
        }),
      });

      const json = await res.json();
      console.log('[Atlas Checkout] cartCreate response:', JSON.stringify(json, null, 2));
      const checkoutUrl = json?.data?.cartCreate?.cart?.checkoutUrl;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        // Fallback: cart permalink for non-subscription
        console.error("cartCreate failed:", json?.data?.cartCreate?.userErrors, json?.errors);
        const parts = items.map(item => {
          const product = PRODUCTS[item.slug];
          if (!product) return null;
          const vid = product.variantId.replace('gid://shopify/ProductVariant/', '');
          return `${vid}:${item.quantity}`;
        }).filter(Boolean);
        let fallbackUrl = `https://${SHOPIFY_DOMAIN}/cart/${parts.join(',')}`;
        if (discountCode) fallbackUrl += `?discount=${discountCode}`;
        window.location.href = fallbackUrl;
      }
    } catch (err) {
      console.error("Checkout error:", err);
      const parts = items.map(item => {
        const product = PRODUCTS[item.slug];
        if (!product) return null;
        return `${product.variantId.replace('gid://shopify/ProductVariant/', '')}:${item.quantity}`;
      }).filter(Boolean);
      window.location.href = `https://${SHOPIFY_DOMAIN}/cart/${parts.join(',')}`;
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
