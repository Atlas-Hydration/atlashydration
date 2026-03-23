import { useEffect } from "react";

/**
 * Loads and initializes client-side scripts after React component mount.
 * Handles re-initialization on route changes since DOMContentLoaded
 * won't fire again in SPA navigation.
 */
export function useClientScripts() {
  useEffect(() => {
    const scripts = [
      "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js",
      "/atlashydration/js/shopify.js",
      "/atlashydration/js/main.js",
      "/atlashydration/js/svg-animations.js",
    ];

    const loaded: HTMLScriptElement[] = [];

    function loadScript(src: string): Promise<void> {
      return new Promise((resolve, reject) => {
        // Remove existing script to force re-execution
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) existing.remove();

        const s = document.createElement("script");
        s.src = src;
        s.async = false;
        s.onload = () => resolve();
        s.onerror = () => resolve(); // Don't block on failure
        document.body.appendChild(s);
        loaded.push(s);
      });
    }

    // Load Shopify SDK first, then our scripts (they depend on ShopifyBuy global)
    loadScript(scripts[0]).then(() => {
      // Load remaining scripts sequentially
      return scripts.slice(1).reduce(
        (chain, src) => chain.then(() => loadScript(src)),
        Promise.resolve()
      );
    }).then(() => {
      // Re-trigger initialization since DOMContentLoaded already fired
      if (typeof (window as any).AtlasShop !== "undefined") {
        try {
          (window as any).AtlasShop.init();
        } catch (e) {
          // Ignore — may already be initialized
        }
      }
    });

    return () => {
      loaded.forEach((s) => s.remove());
    };
  }, []);
}
