/**
 * Shared SEO helpers: one place for structured data and social metadata so
 * every page tells search engines the same facts the site actually states.
 * Shipping and returns mirror /shipping and the product-page returns copy.
 */
import { FREE_SHIPPING_THRESHOLD, SHIPPING_RATE } from "@/app/data/formula";

export const SITE_URL = "https://atlas-hydration.com";
export const SITE_NAME = "Atlas Hydration";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og/default.png`;

/**
 * Real review numbers for the Product markup. Leave null unless these match the
 * reviews actually shown on the page (Google treats mismatched ratings as spam).
 * To enable star ratings in search: { ratingValue: "4.9", reviewCount: "37" }.
 */
export const REVIEW_SUMMARY: { ratingValue: string; reviewCount: string } | null = null;

export function reviewJsonLd() {
  return REVIEW_SUMMARY
    ? { aggregateRating: { "@type": "AggregateRating", ratingValue: REVIEW_SUMMARY.ratingValue, reviewCount: REVIEW_SUMMARY.reviewCount } }
    : {};
}

const usd = (n: number) => ({ "@type": "MonetaryAmount", value: n.toFixed(2), currency: "USD" });
const days = (min: number, max: number) => ({ "@type": "QuantitativeValue", minValue: min, maxValue: max, unitCode: "DAY" });

/** Offer with the shipping and returns policy stated on /shipping (US only). */
export function buildOffer({ url, price, preorder = false }: { url: string; price: string; preorder?: boolean }) {
  const delivery = {
    "@type": "ShippingDeliveryTime",
    handlingTime: days(1, 2), // 1-2 business days processing
    transitTime: days(4, 6), // 4-6 business days delivery
  };
  const destination = { "@type": "DefinedRegion", addressCountry: "US" };
  return {
    "@type": "Offer",
    url,
    price,
    priceCurrency: "USD",
    availability: preorder ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    shippingDetails: [
      {
        "@type": "OfferShippingDetails",
        shippingRate: usd(0),
        shippingDestination: destination,
        shippingConditions: { "@type": "ShippingConditions", orderValue: { "@type": "MonetaryAmount", minValue: FREE_SHIPPING_THRESHOLD, currency: "USD" } },
        deliveryTime: delivery,
      },
      {
        "@type": "OfferShippingDetails",
        shippingRate: usd(SHIPPING_RATE),
        shippingDestination: destination,
        shippingConditions: { "@type": "ShippingConditions", orderValue: { "@type": "MonetaryAmount", maxValue: FREE_SHIPPING_THRESHOLD - 0.01, currency: "USD" } },
        deliveryTime: delivery,
      },
    ],
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "US",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: 30,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/** Twitter card that mirrors the Open Graph title, description and image. */
export function twitterCard({ title, description, image }: { title: string; description: string; image: string }) {
  return { card: "summary_large_image" as const, title, description, images: [image] };
}
