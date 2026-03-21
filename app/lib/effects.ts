/**
 * Atlas Hydration — Main Effects Module
 *
 * Dynamically loads the original main.js after React has rendered the DOM.
 * This ensures all DOM elements exist before the vanilla JS event listeners bind.
 */

let scriptsLoaded = false;

export function initEffects(): () => void {
  if (scriptsLoaded) return () => {};
  scriptsLoaded = true;

  const scripts: HTMLScriptElement[] = [];

  // Load Shopify Buy SDK from CDN
  const sdkScript = document.createElement("script");
  sdkScript.src =
    "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";
  sdkScript.defer = true;
  document.body.appendChild(sdkScript);
  scripts.push(sdkScript);

  // Load Junip Reviews widget
  const junipScript = document.createElement("script");
  junipScript.src = "https://widgets.juniphq.com/v1/junip_shopify.js";
  junipScript.async = true;
  document.body.appendChild(junipScript);
  scripts.push(junipScript);

  // Load shopify.js after SDK is available
  const shopifyScript = document.createElement("script");
  shopifyScript.src = "/atlashydration/js/shopify.js";
  shopifyScript.defer = true;
  document.body.appendChild(shopifyScript);
  scripts.push(shopifyScript);

  // Load main.js after DOM is ready
  const mainScript = document.createElement("script");
  mainScript.src = "/atlashydration/js/main.js";
  mainScript.defer = true;
  document.body.appendChild(mainScript);
  scripts.push(mainScript);

  // Return cleanup function
  return () => {
    scripts.forEach((s) => {
      if (s.parentNode) s.parentNode.removeChild(s);
    });
    scriptsLoaded = false;
  };
}
