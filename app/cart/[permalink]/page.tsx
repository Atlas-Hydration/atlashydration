import { Suspense } from "react";
import CartPermalinkClient from "./CartPermalinkClient";
import { PRODUCTS } from "@/app/data/products";

// This route is genuinely dynamic (arbitrary variant/quantity combinations), which
// output:"export" (the GitHub Pages fallback build) can't represent directly — it
// needs generateStaticParams() to know what to pre-render. The primary host (Vercel)
// runs this as a real dynamic server route regardless, so this only matters for the
// fallback: pre-render the single-quantity permalink for each real product, which
// covers the common case (Instagram's checkout handoff always sends qty:1 unless the
// shopper changed it) without trying to enumerate every possible quantity.
export async function generateStaticParams() {
  return Object.values(PRODUCTS).map((product) => ({
    permalink: `${product.variantId.replace("gid://shopify/ProductVariant/", "")}:1`,
  }));
}

export default async function CartPermalinkPage({
  params,
}: {
  params: Promise<{ permalink: string }>;
}) {
  const { permalink } = await params;
  return (
    <Suspense fallback={null}>
      <CartPermalinkClient permalink={permalink} />
    </Suspense>
  );
}
