import type { Metadata } from "next";
import { PRODUCTS } from "@/app/data/products";
import ProductPage from "@/app/components/ProductPage";
import { FORMULA, FORMULA_TOTAL, FORMULA_ELECTROLYTE_BREAKDOWN, FREE_SHIPPING_THRESHOLD } from "@/app/data/formula";

export const metadata: Metadata = {
  title: "Strawberry Lemonade Electrolytes | Atlas Hydration",
  description: "Zero-sugar electrolyte drink mix with 1,769mg electrolytes, B vitamins, Vitamin C, and recovery amino acids. 16 stick packs per box.",
  alternates: { canonical: "https://atlas-hydration.com/products/strawberry-lemonade" },
  openGraph: {
    type: "website",
    url: "https://atlas-hydration.com/products/strawberry-lemonade",
    title: "Strawberry Lemonade Electrolytes | Atlas Hydration",
    description: "Zero-sugar electrolyte drink mix with 1,769mg electrolytes, B vitamins, Vitamin C, and recovery amino acids.",
    siteName: "Atlas Hydration",
    images: ["https://cdn.shopify.com/s/files/1/0595/8133/3578/files/1_e4b7eae7-01d9-430c-9655-7949d910deb6.jpg?v=1771507844"],
  },
};

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Atlas Hydration Strawberry Lemonade Electrolytes",
  description: "Premium zero-sugar electrolyte drink mix with 1,769mg electrolytes, B vitamins, Vitamin C, and recovery amino acids. 16 stick packs per box.",
  image: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/1_e4b7eae7-01d9-430c-9655-7949d910deb6.jpg?v=1771507844",
  brand: { "@type": "Brand", name: "Atlas Hydration" },
  offers: {
    "@type": "Offer",
    price: PRODUCTS["strawberry-lemonade"].price.toFixed(2),
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: "https://atlas-hydration.com/products/strawberry-lemonade",
  },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "20" },
  nutrition: {
    "@type": "NutritionInformation",
    calories: `${FORMULA.calories} calories`,
    sodiumContent: `${FORMULA.sodiumMg}mg`,
    sugarContent: "0g",
    servingSize: `1 stick pack (${FORMULA.servingG}g)`,
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What electrolytes does Atlas contain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Each stick pack contains ${FORMULA_ELECTROLYTE_BREAKDOWN}. See the full Supplement Facts panel on this page for every ingredient and daily value.`,
      },
    },
    {
      "@type": "Question",
      name: "Is Atlas sugar-free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Yes. Atlas has zero grams of sugar and ${FORMULA.calories} calories per stick pack. It is sweetened with stevia leaf extract and allulose.`,
      },
    },
    {
      "@type": "Question",
      name: "What vitamins and amino acids are included?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Vitamin C (90mg), niacin/B3 (24mg), pantethine/B5 (12mg), vitamin B6 (2mg), and vitamin B12 (8mcg). For recovery support: 1,000mg L-Glutamine and 200mg L-Alanine.",
      },
    },
    {
      "@type": "Question",
      name: "How do I use Atlas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mix one stick pack with 12-16 oz of cold water, then shake or stir until dissolved. Use it around training, travel, time in the heat, or any time you want to replace electrolytes.",
      },
    },
    {
      "@type": "Question",
      name: "How does Atlas compare to other electrolyte mixes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `Every brand formulates differently, so compare the labels. Atlas provides ${FORMULA_TOTAL}mg total electrolytes with zero sugar and ${FORMULA.calories} calories per stick, plus B vitamins, vitamin C, L-Glutamine, and L-Alanine.`,
      },
    },
  ],
};

const images = [
  { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/1_e4b7eae7-01d9-430c-9655-7949d910deb6.jpg?v=1771507844", alt: "Atlas Strawberry Lemonade pouch and stick pack" },
  { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/2_e035ddf8-ce06-45b8-a18b-9c44b182ef6c.jpg?v=1771507845", alt: "Atlas Strawberry Lemonade lifestyle" },
  { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/3_ef424a03-cf99-4791-be11-6c35c35c9a78.jpg?v=1771507844", alt: "Atlas Strawberry Lemonade mixing" },
  { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/5_6e370a4a-9031-4d8e-a7f2-59e717e0d02d.jpg?v=1771507860", alt: "Atlas Strawberry Lemonade ingredients" },
  { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/6_b41fe7f1-0bca-41d3-8bf7-db4414e95a05.jpg?v=1771507860", alt: "Atlas Strawberry Lemonade supplement facts" },
  { src: "https://cdn.shopify.com/s/files/1/0595/8133/3578/files/4_b0347d0a-fc88-4c2b-b4a7-3946604c666e.jpg?v=1771507860", alt: "Atlas Strawberry Lemonade active lifestyle" },
];

const accordionItems = [
  {
    icon: <svg className="product-accordion__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
    title: "Description & Ingredients",
    content: (
      <>
        <p><strong>Atlas Hydration Strawberry Lemonade</strong> is a premium zero-sugar electrolyte drink mix built for daily performance hydration: training, travel, heat, recovery, and long workdays. Each box contains 16 individually wrapped stick packs — perfect for the gym, office, or travel.</p>
        <p><strong>Electrolytes:</strong> Sodium {FORMULA.sodiumMg}mg, Magnesium {FORMULA.magnesiumMg}mg, Potassium {FORMULA.potassiumMg}mg. <strong>Vitamins:</strong> Vitamin C 90mg, Niacin (B3) 24mg, Pantethine (B5) 12mg, Vitamin B6 2mg, Vitamin B12 8mcg. <strong>Amino Acids:</strong> L-Glutamine 1,000mg, L-Alanine 200mg.</p>
        <p><strong>Other Ingredients:</strong> Allulose, Citric Acid, Inulin, Natural Flavors, Malic Acid, Silicon Dioxide, Rebaudioside A (from Stevia Leaf Extract).</p>
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
        <p><strong>Free shipping</strong> on U.S. orders over ${FREE_SHIPPING_THRESHOLD}. Orders under ${FREE_SHIPPING_THRESHOLD} ship for $4.99 (4–6 business days). Subscriptions always ship free.</p>
        <p><strong>Satisfaction guaranteed:</strong> If you&apos;re not completely happy with your order, contact us within 30 days for a full refund or exchange — no questions asked.</p>
        <p>We currently ship within the United States. International shipping coming soon.</p>
      </>
    ),
  },
];

export default function StrawberryLemonade() {
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    <ProductPage
      config={{
        slug: "strawberry-lemonade",
        flavorName: "Strawberry Lemonade",
        junipProductId: "7693950255178",
        images,
        accordionItems,
        activeFlavorClass: "strawberry",
        supplementFactsProps: { formula: "current" },
        ctaTitle: <>Ready to Try <span className="wave-text">Strawberry Lemonade?</span></>,
        ctaText: `16 stick packs. ${FORMULA_TOTAL}mg electrolytes. Zero sugar. ${FORMULA.calories} calories.`,
      }}
    />
    </>
  );
}
