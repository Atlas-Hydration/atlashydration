import { BLACK_FRIDAY } from "@/app/data/blackFriday";
import { buildOneTimeCheckoutUrl } from "@/app/lib/checkoutAttribution";

export function buildBlackFridayCheckoutUrl() {
  const url = new URL(buildOneTimeCheckoutUrl([`${BLACK_FRIDAY.variantId}:${BLACK_FRIDAY.quantity}`]));
  url.searchParams.set("discount", BLACK_FRIDAY.discountCode);
  return url.toString();
}

export function openBlackFridayCheckout() {
  window.location.assign(buildBlackFridayCheckoutUrl());
}
