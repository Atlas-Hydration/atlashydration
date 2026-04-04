'use client';

// =============================================
// CONFIG
// =============================================
export const PASSWORD = '123';
export const WORKER_URL = 'https://atlas-shopify-proxy.YOUR_SUBDOMAIN.workers.dev';
export const USE_WORKER = WORKER_URL.indexOf('YOUR_SUBDOMAIN') === -1;

export const SHOPIFY = {
  domain: '7fa7b7-42.myshopify.com',
  storefrontToken: '390caf7f28b55c8958daeab3fcd55f76',
  storefrontEndpoint: 'https://7fa7b7-42.myshopify.com/api/2024-01/graphql.json',
};

// =============================================
// TYPES
// =============================================
export interface ProductVariantNode {
  id: string;
  title: string;
  selectedOptions: { name: string; value: string }[];
  // Fields vary between Admin API (strings) and Storefront API (objects).
  // Use type assertions in components to access these.
  [key: string]: unknown;
}

export interface ProductNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  productType: string;
  vendor: string;
  tags: string[];
  // Admin API
  status?: string;
  // Storefront API
  availableForSale?: boolean;
  createdAt: string;
  updatedAt: string;
  images: { edges: { node: { url: string; altText: string | null } }[] };
  options: { name: string; values: string[] }[];
  variants: { edges: { node: ProductVariantNode }[] };
  // Admin API
  priceRangeV2?: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  // Storefront API
  priceRange?: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
}

export interface CollectionNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  updatedAt: string;
  productsCount?: number;
  products: { edges: { node: { title: string } }[] };
}

export interface ShopInfo {
  name: string;
  description?: string;
  url?: string;
  myshopifyDomain?: string;
  plan?: { displayName: string };
  currencyCode: string;
  billingAddress?: { country: string };
  contactEmail?: string;
  email?: string;
  enabledPresentmentCurrencies: string[];
  moneyFormat?: string;
  paymentSettings?: {
    currencyCode: string;
    acceptedCardBrands: string[];
    enabledPresentmentCurrencies: string[];
  };
}

export interface CustomerNode {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  ordersCount: number;
  totalSpent: string;
  createdAt: string;
  updatedAt: string;
  state?: string;
  tags?: string[];
  addresses?: { city?: string; province?: string; country?: string }[];
  lastOrder?: {
    id: string;
    name: string;
    createdAt: string;
    totalPriceSet?: { shopMoney: { amount: string; currencyCode: string } };
  };
}

export interface OrderNode {
  id: string;
  name: string;
  createdAt: string;
  displayFulfillmentStatus: string;
  displayFinancialStatus: string;
  totalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
  subtotalPriceSet?: { shopMoney: { amount: string; currencyCode: string } };
  customer?: { firstName?: string; lastName?: string; email?: string };
  lineItems: {
    edges: {
      node: {
        title: string;
        quantity: number;
        originalTotalSet?: { shopMoney: { amount: string } };
      };
    }[];
  };
}

// =============================================
// GQL FETCH
// =============================================
export async function gql(query: string): Promise<unknown> {
  let url: string;
  let headers: Record<string, string>;

  if (USE_WORKER) {
    url = WORKER_URL;
    headers = { 'Content-Type': 'application/json' };
  } else {
    url = SHOPIFY.storefrontEndpoint;
    headers = {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY.storefrontToken,
    };
  }

  const r = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query }),
  });

  if (!r.ok) {
    const body = await r.text();
    throw new Error(`HTTP ${r.status}: ${body.substring(0, 120) || r.statusText}`);
  }

  const json = await r.json() as { errors?: { message: string }[]; data: unknown };
  if (json.errors && json.errors.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }
  return json;
}

// =============================================
// FETCH PRODUCTS
// =============================================
export async function fetchProducts(): Promise<ProductNode[]> {
  if (USE_WORKER) {
    const data = await gql(`{
      products(first: 50) {
        edges {
          node {
            id title handle description productType vendor tags status
            createdAt updatedAt
            images(first: 1) { edges { node { url altText } } }
            options { name values }
            variants(first: 50) {
              edges {
                node {
                  id title price compareAtPrice inventoryQuantity sku weight weightUnit
                  selectedOptions { name value }
                }
              }
            }
            priceRangeV2 {
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
          }
        }
      }
    }`) as { data: { products: { edges: { node: ProductNode }[] } } };
    return data.data.products.edges.map((e) => e.node);
  }

  const data = await gql(`{
    products(first: 50) {
      edges {
        node {
          id title handle description productType vendor tags availableForSale
          createdAt updatedAt
          images(first: 1) { edges { node { url altText } } }
          options { name values }
          variants(first: 50) {
            edges {
              node {
                id title availableForSale
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                selectedOptions { name value }
              }
            }
          }
          priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
        }
      }
    }
  }`) as { data: { products: { edges: { node: ProductNode }[] } } };
  return data.data.products.edges.map((e) => e.node);
}

// =============================================
// FETCH COLLECTIONS
// =============================================
export async function fetchCollections(): Promise<CollectionNode[]> {
  if (USE_WORKER) {
    const data = await gql(`{
      collections(first: 20) {
        edges {
          node {
            id title handle description updatedAt productsCount
            products(first: 10) { edges { node { title } } }
          }
        }
      }
    }`) as { data: { collections: { edges: { node: CollectionNode }[] } } };
    return data.data.collections.edges.map((e) => e.node);
  }

  const data = await gql(`{
    collections(first: 20) {
      edges {
        node {
          id title handle description updatedAt
          products(first: 10) { edges { node { title } } }
        }
      }
    }
  }`) as { data: { collections: { edges: { node: CollectionNode }[] } } };
  return data.data.collections.edges.map((e) => e.node);
}

// =============================================
// FETCH SHOP INFO
// =============================================
export async function fetchShopInfo(): Promise<ShopInfo> {
  if (USE_WORKER) {
    const data = await gql(`{
      shop {
        name description url myshopifyDomain
        plan { displayName }
        currencyCode
        billingAddress { country }
        contactEmail email
        enabledPresentmentCurrencies
      }
    }`) as { data: { shop: ShopInfo } };
    return data.data.shop;
  }

  const data = await gql(`{
    shop {
      name description moneyFormat
      paymentSettings {
        currencyCode acceptedCardBrands enabledPresentmentCurrencies
      }
    }
  }`) as { data: { shop: ShopInfo } };
  const shop = data.data.shop;
  shop.currencyCode = shop.paymentSettings?.currencyCode ?? 'USD';
  shop.enabledPresentmentCurrencies = shop.paymentSettings?.enabledPresentmentCurrencies ?? [];
  return shop;
}

// =============================================
// FETCH CUSTOMERS (Admin API only)
// =============================================
export async function fetchCustomers(): Promise<CustomerNode[]> {
  if (!USE_WORKER) return []; // Customers require Admin API, not available via Storefront
  const data = await gql(`{
    customers(first: 50, sortKey: UPDATED_AT, reverse: true) {
      edges {
        node {
          id firstName lastName email phone ordersCount totalSpent
          createdAt updatedAt state tags
          addresses(first: 1) { city province country }
          lastOrder {
            id name createdAt
            totalPriceSet { shopMoney { amount currencyCode } }
          }
        }
      }
    }
  }`) as { data: { customers: { edges: { node: CustomerNode }[] } } };
  return data.data.customers.edges.map((e) => e.node);
}

// =============================================
// FETCH ORDERS (Admin API only)
// =============================================
export async function fetchOrders(): Promise<OrderNode[]> {
  if (!USE_WORKER) return []; // Orders require Admin API, not available via Storefront
  const data = await gql(`{
    orders(first: 50, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id name createdAt
          displayFulfillmentStatus displayFinancialStatus
          totalPriceSet { shopMoney { amount currencyCode } }
          subtotalPriceSet { shopMoney { amount currencyCode } }
          customer { firstName lastName email }
          lineItems(first: 10) {
            edges {
              node {
                title quantity
                originalTotalSet { shopMoney { amount } }
              }
            }
          }
        }
      }
    }
  }`) as { data: { orders: { edges: { node: OrderNode }[] } } };
  return data.data.orders.edges.map((e) => e.node);
}
