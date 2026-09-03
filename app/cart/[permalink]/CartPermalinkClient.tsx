"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Shopify's own "cart permalink" format: /cart/{variantId}:{qty},{variantId}:{qty},...
// Meta/Instagram's checkout handoff builds this URL against whatever domain is set as
// the product's "Website link" in the catalog — which for this headless storefront is
// atlas-hydration.com, not the actual Shopify store domain. Only Shopify knows how to
// interpret this path, so we replicate it here: parse the permalink ourselves and POST
// straight to Shopify's real /cart/add, exactly like CartContext's checkout() does.
const SHOPIFY_DOMAIN = "7fa7b7-42.myshopify.com";

export default function CartPermalinkClient({ permalink }: { permalink: string }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!permalink) {
      window.location.replace("/");
      return;
    }

    // Next.js can hand this segment back still percent-encoded (":" as "%3A"),
    // so decode it before splitting on "," and ":".
    const decodedPermalink = decodeURIComponent(permalink);
    const items = decodedPermalink
      .split(",")
      .map((entry) => {
        const [id, qty] = entry.split(":");
        return { id, quantity: qty || "1" };
      })
      .filter((item) => item.id);

    if (items.length === 0) {
      window.location.replace("/");
      return;
    }

    const form = document.createElement("form");
    form.method = "POST";
    form.action = `https://${SHOPIFY_DOMAIN}/cart/add`;
    form.style.display = "none";

    const addField = (name: string, value: string) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };

    items.forEach((item, i) => {
      addField(`items[${i}][id]`, item.id);
      addField(`items[${i}][quantity]`, item.quantity);
    });

    // Forward any attributes[...] the caller passed through (e.g. Instagram's
    // Channel / cart-id / seller-id tracking attributes) straight to Shopify.
    searchParams.forEach((value, key) => {
      if (key.startsWith("attributes[") && key.endsWith("]")) {
        addField(key, value);
      }
    });

    addField("return_to", "/checkout");

    document.body.appendChild(form);
    form.submit();
  }, [permalink, searchParams]);

  return (
    <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 20px" }}>
      <p>Taking you to checkout…</p>
    </main>
  );
}
