import type { Metadata } from "next";
import ProductPage from "@/app/components/ProductPage";

export const metadata: Metadata = {
  title: "Grapefruit Electrolytes | Atlas Hydration",
  description: "Zero-sugar grapefruit electrolyte drink mix with 1,769mg electrolytes, B vitamins, Vitamin C, and recovery amino acids. 16 stick packs per box.",
  openGraph: {
    title: "Grapefruit Electrolytes | Atlas Hydration",
    description: "Zero-sugar grapefruit electrolyte drink mix with 1,769mg electrolytes, B vitamins, Vitamin C, and recovery amino acids.",
    images: ["https://cdn.shopify.com/s/files/1/0595/8133/3578/files/1_1a252c57-dc62-4c7b-a6b1-0f9677ce6b6f.jpg?v=1769181320"],
  },
};

const images = [
  { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/1_1a252c57-dc62-4c7b-a6b1-0f9677ce6b6f.jpg?v=1769181320", alt: "Atlas Grapefruit pouch and stick pack" },
  { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/3_895d9a50-ff83-4081-a78b-7c5034614a38.jpg?v=1769181320", alt: "Atlas Grapefruit lifestyle" },
  { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/6_9aa2f5c5-dc91-499b-a36e-2ddb0ba45f49.jpg?v=1769181321", alt: "Atlas Grapefruit mixing" },
  { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/4_04a1c3d2-929b-4150-bf92-64f0f83445b1.jpg?v=1769181321", alt: "Atlas Grapefruit active lifestyle" },
];

const accordionItems = [
  {
    icon: <svg className="product-accordion__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
    title: "Description & Ingredients",
    content: (
      <>
        <p><strong>Atlas Hydration Grapefruit</strong> is a premium zero-sugar electrolyte drink mix engineered for superior hydration, recovery, and everyday performance. Each box contains 16 individually wrapped stick packs — perfect for the gym, office, or travel.</p>
        <p><strong>Key Electrolytes:</strong> Sodium 500mg, Potassium 400mg, Magnesium 60mg. <strong>Vitamins:</strong> Vitamin C 90mg, Niacin (B3) 20mg, Pantothenic Acid (B5) 10mg, Vitamin B6 2mg, Vitamin B12 8mcg. <strong>Amino Acids:</strong> L-Glutamine 1,000mg, L-Taurine 200mg.</p>
        <p><strong>Other Ingredients:</strong> Citric Acid, Natural Grapefruit Flavor, Bamboo Extract, Grapefruit Oil, Annatto Seed Extract (color), Stevia Leaf Extract, Allulose.</p>
      </>
    ),
  },
  {
    icon: <svg className="product-accordion__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" /></svg>,
    title: "How to Use",
    content: (
      <>
        <p>Mix one stick pack with 12–16 oz of cold water and shake or stir until dissolved. Adjust water to taste — less water for a stronger flavor, more for a lighter drink.</p>
        <p><strong>When to drink:</strong> First thing in the morning, during or after workouts, while traveling, or anytime you need a hydration boost. Use daily for best results.</p>
        <p><strong>Storage:</strong> Store in a cool, dry place. No refrigeration needed until mixed.</p>
      </>
    ),
  },
  {
    icon: <svg className="product-accordion__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>,
    title: "Shipping & Returns",
    content: (
      <>
        <p><strong>Free shipping</strong> on all U.S. orders over $50. Standard shipping (3–5 business days) is $4.99. Expedited options available at checkout.</p>
        <p><strong>Satisfaction guaranteed:</strong> If you&apos;re not completely happy with your order, contact us within 30 days for a full refund or exchange — no questions asked.</p>
        <p>We currently ship within the United States. International shipping coming soon.</p>
      </>
    ),
  },
];

export default function Grapefruit() {
  return (
    <ProductPage
      config={{
        slug: "grapefruit",
        flavorName: "Grapefruit",
        junipProductId: "7862662103114",
        images,
        accordionItems,
        activeFlavorClass: "grapefruit",
        ctaTitle: "Ready to Try Grapefruit?",
        ctaText: "16 stick packs of crisp, refreshing hydration. Zero sugar. Five calories. Full performance.",
        supplementFactsProps: { otherIngredients: "Citric Acid, Bamboo Extract, Grapefruit Oil, Annatto Seed Extract (color)" },
        preorder: true,
      }}
    />
  );
}
