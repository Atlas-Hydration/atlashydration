/** Website-only offer. Shopify owns the actual discount and shipping. */
export const BLACK_FRIDAY = {
  productSlug: "strawberry-lemonade",
  variantId: "42739482067018",
  price: 20,
  endLabel: "Sale ends Monday, November 30",
  quantity: 1,
  sticks: 16,
  discountCode: "ATLASBLACKFRIDAY",
  shipping: "Free standard U.S. shipping",
} as const;

export function isBlackFridayProduct(slug: string) {
  return slug === BLACK_FRIDAY.productSlug;
}
