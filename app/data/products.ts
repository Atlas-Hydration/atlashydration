export interface Product {
  name: string;
  slug: string;
  price: number;
  subscribePrice: number;
  perStick: number;
  subscribePerStick: number;
  variantId: string;
  color: string;
  colorRgb: string;
  images: string[];
  description: string;
  tags: string[];
}

export const PRODUCTS: Record<string, Product> = {
  "strawberry-lemonade": {
    name: "Strawberry Lemonade",
    slug: "strawberry-lemonade",
    price: 29.99,
    subscribePrice: 23.99,
    perStick: 1.87,
    subscribePerStick: 1.50,
    variantId: "gid://shopify/ProductVariant/42739482067018",
    color: "#e85d75",
    colorRgb: "232, 93, 117",
    images: [
      "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/1_e4b7eae7-01d9-430c-9655-7949d910deb6.jpg?v=1771507844",
      "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/2_e035ddf8-ce06-45b8-a18b-9c44b182ef6c.jpg?v=1771507845",
      "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/3_ef424a03-cf99-4791-be11-6c35c35c9a78.jpg?v=1771507844",
      "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/5_6e370a4a-9031-4d8e-a7f2-59e717e0d02d.jpg?v=1771507860",
    ],
    description:
      "A refreshing blend of sweet strawberries and tart lemonade. Zero sugar, packed with essential electrolytes and vitamins to keep you hydrated all day.",
    tags: [
      "Zero Sugar",
      "16 Sticks",
      "Electrolytes",
      "B Vitamins",
      "Vitamin C",
      "Keto Friendly",
    ],
  },
  grapefruit: {
    name: "Grapefruit",
    slug: "grapefruit",
    price: 29.99,
    subscribePrice: 23.99,
    perStick: 1.87,
    subscribePerStick: 1.50,
    variantId: "gid://shopify/ProductVariant/41850457817162",
    color: "#f5a623",
    colorRgb: "245, 166, 35",
    images: [
      "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/1_1a252c57-dc62-4c7b-a6b1-0f9677ce6b6f.jpg?v=1769181320",
      "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/3_895d9a50-ff83-4081-a78b-7c5034614a38.jpg?v=1769181320",
      "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/6_9aa2f5c5-dc91-499b-a36e-2ddb0ba45f49.jpg?v=1769181321",
      "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/4_04a1c3d2-929b-4150-bf92-64f0f83445b1.jpg?v=1769181321",
    ],
    description:
      "Bright, citrusy grapefruit flavor that energizes and hydrates. Zero sugar, loaded with electrolytes and essential vitamins for peak performance.",
    tags: [
      "Zero Sugar",
      "16 Sticks",
      "Electrolytes",
      "B Vitamins",
      "Vitamin C",
      "Keto Friendly",
    ],
  },
};
