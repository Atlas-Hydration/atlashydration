"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { PRODUCTS } from "@/app/data/products";
import { setMetaConsent, trackMeta } from "@/app/lib/metaPixel";

export default function MetaPixel({ accepted }: { accepted: boolean }) {
  const pathname = usePathname();
  const lastPage = useRef<string | null>(null);
  useEffect(() => {
    const publicPage = !!pathname && !/^\/(app|api)(\/|$)/.test(pathname);
    setMetaConsent(accepted && publicPage);
    if (!accepted || !publicPage || !pathname) { lastPage.current = null; return; }
    if (lastPage.current === pathname) return;
    lastPage.current = pathname;
    trackMeta("PageView");
    const slug = pathname.match(/^\/products\/([^/]+)\/?$/)?.[1];
    const product = slug ? PRODUCTS[slug] : undefined;
    if (product) trackMeta("ViewContent", {
      content_ids: [product.variantId.replace("gid://shopify/ProductVariant/", "")],
      content_type: "product", currency: "USD", value: product.price,
    });
  }, [accepted, pathname]);
  return null;
}
