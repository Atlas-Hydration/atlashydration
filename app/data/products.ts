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
      "/images/strawberry-lemonade-1.webp",
      "/images/strawberry-lemonade-2.webp",
      "/images/strawberry-lemonade-3.webp",
      "/images/strawberry-lemonade-4.webp",
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
      "/images/grapefruit-1.webp",
      "/images/grapefruit-2.webp",
      "/images/grapefruit-3.webp",
      "/images/grapefruit-4.webp",
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
