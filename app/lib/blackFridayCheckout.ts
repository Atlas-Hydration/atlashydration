import { BLACK_FRIDAY } from "@/app/data/blackFriday";
import { buildOneTimeCheckoutUrl } from "@/app/lib/checkoutAttribution";

export function buildBlackFridayCheckoutUrl() {
  return buildOneTimeCheckoutUrl([`${BLACK_FRIDAY.variantId}:${BLACK_FRIDAY.quantity}`]);
}

export function openBlackFridayCheckout() {
  window.location.assign(buildBlackFridayCheckoutUrl());
}
