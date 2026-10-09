import { PRODUCTS } from "@/app/data/products";

type Line = {
  slug: string; title: string; price: number; quantity: number;
  image: string | null; subscriptionFrequency?: number;
};

// Ensure this exact offer is present without discarding the customer's other
// items or duplicating the bundle when the CTA is tapped again.
export function ensureFourPouchBundle(items: Line[]): Line[] {
  const next = items.map((item) => ({ ...item }));
  for (const [slug, quantity] of [["strawberry-lemonade", 4], ["bottle", 1]] as const) {
    const existing = next.find((item) => item.slug === slug && !item.subscriptionFrequency);
    if (existing) existing.quantity = Math.max(existing.quantity, quantity);
    else {
      const product = PRODUCTS[slug];
      next.push({ slug, quantity, title: product.name, price: product.price, image: product.images[0] ?? null });
    }
  }
  return next;
}
