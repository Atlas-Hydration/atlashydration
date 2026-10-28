"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { PRODUCTS } from "@/app/data/products";
import { setMetaConsent, trackMeta } from "@/app/lib/metaPixel";
import { captureCheckoutAttribution } from "@/app/lib/checkoutAttribution";
import { STARTER_OFFER, STARTER_OFFER_LIVE } from "@/app/data/starterOffer";

export default function MetaPixel({ accepted }: { accepted: boolean }) {
  const pathname = usePathname();
  const lastPage = useRef<string | null>(null);
  useEffect(() => {
    const publicPage = !!pathname && !/^\/(app|api)(\/|$)/.test(pathname);
    setMetaConsent(accepted && publicPage);
    captureCheckoutAttribution(accepted && publicPage);
    if (!accepted || !publicPage || !pathname) { lastPage.current = null; return; }
    if (lastPage.current === pathname) return;
    lastPage.current = pathname;
    trackMeta("PageView");
    const slug = pathname.match(/^\/products\/([^/]+)\/?$/)?.[1];
    // Match the default selected Starter Kit offer, not its undiscounted components.
    const starter = slug === "strawberry-lemonade" && STARTER_OFFER_LIVE;
    const product = slug ? PRODUCTS[starter ? "atlas-starter-kit" : slug] : undefined;
    if (product) trackMeta("ViewContent", {
      content_ids: [product.variantId.replace("gid://shopify/ProductVariant/", "")],
      content_type: "product", currency: "USD", value: starter ? STARTER_OFFER.price : product.price,
    });
  }, [accepted, pathname]);
  return null;
}
