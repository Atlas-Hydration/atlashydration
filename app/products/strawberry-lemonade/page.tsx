import type { Metadata } from "next";
import { PRODUCTS } from "@/app/data/products";
import { buildOffer, reviewJsonLd, breadcrumbJsonLd, twitterCard } from "@/app/data/seo";
import StrawberryLemonadeView from "./StrawberryLemonadeView";
import { FORMULA, FORMULA_TOTAL, FORMULA_ELECTROLYTE_BREAKDOWN } from "@/app/data/formula";

export const metadata: Metadata = {
  title: "Strawberry Lemonade Electrolytes | Atlas Hydration",
  description: "Zero-sugar electrolyte drink mix with 1,769mg electrolytes, B vitamins, Vitamin C, and recovery amino acids. 16 stick packs per box.",
  alternates: { canonical: "https://atlas-hydration.com/products/strawberry-lemonade" },
  twitter: twitterCard({ title: "Strawberry Lemonade Electrolytes | Atlas Hydration", description: "Zero-sugar electrolyte drink mix with B vitamins, vitamin C, and amino acids. 16 stick packs.", image: PRODUCTS["strawberry-lemonade"].images[0] }),
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
  sku: PRODUCTS["strawberry-lemonade"].variantId.replace("gid://shopify/ProductVariant/", ""),
  offers: buildOffer({ url: "https://atlas-hydration.com/products/strawberry-lemonade", price: PRODUCTS["strawberry-lemonade"].price.toFixed(2), preorder: false }),
  ...reviewJsonLd(),
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

export default function StrawberryLemonade() {
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Strawberry Lemonade Electrolytes", path: "/products/strawberry-lemonade" }])) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    <StrawberryLemonadeView />
    </>
  );
}
