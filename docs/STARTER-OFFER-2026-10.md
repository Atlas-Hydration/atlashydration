# Atlas starter offer — October 2026

Existing homepage, Strawberry Lemonade page and bottle cross-sell placements use
one inventory-linked Shopify bundle. No new frontend product route or landing page.

## Shopify source of truth

- Product 15413071020106, variant 67691017732170, Atlas Starter Kit.
- Two units of product 7693950255178 / variant 42739482067018 / SKU SLV2.
- One unit of product 8405820440650 / variant 44103798358090 / SKU 3.
- Bundles manages component inventory; initial availability 29 kits, no overselling.
- Product value $83.97; automatic amount-off-products discount 1539478388810
  takes $33.97 off EACH kit. All customers, one-time purchase, no minimum,
  no end date, no product/order/shipping discount combinations. Net $50 per kit.
- $83.97 is the sum of separately purchased components, never a former bundle price.
- Product is Unlisted, Online Store only. The headless frontend adds its actual
  variant. No social/advertising channel publishing.
- General shipping profile 82372165706: standard US remains $5, now free at
  $50 and up, 3–4 business days. Express unchanged at $12, 1–2 business days.
  This rate threshold also benefits other qualifying carts. Existing one-time
  and subscription shipping discounts remain unchanged.
- Old half-off bottle discount 1446081101898 deactivated. Existing ATLAS2PACK
  1535338610762 and four-pouch/free-bottle 1445918572618 retained.
- Tax charging remains enabled. Expiration is 01/2027, without a fabricated day.

## Verification

- TypeScript and production build pass.
- Nine pricing regression cases in tests/starter-pricing.cjs cover quantity,
  mixed-cart discount exclusivity, the retired half-off offer and subscriptions.
- Live Shopify: one kit $50, three components; two kits $100, four pouches and
  two bottles; standard US FREE, express $12. Returning Shop Pay and guest route.
- WELCOME10 and ATLASWELCOME10 rejected as non-combinable with starter savings.
- Mixed kit + two extra pouches: $113.98, no stacked ATLAS2PACK.
- Google Pay opens with correct mixed-cart amount; requires card/address setup.
  PayPal reaches login; Amazon Pay reaches address/payment review. Neither
  provider continued or authorized. Shop Pay final pre-payment total verified.
- Guest rate calculated using city/postcode only, no contact email or payment
  submitted. No order created. Marketing checkbox deselected in guest test.
- Desktop and 390px mobile offer/cart reviewed. Sticky single-pouch CTA hidden
  while starter offer is visible. Other purchase/subscription options retained.
- One-time checkout uses Shopify cart permalink, replacing rather than repeatedly
  appending cart lines. Existing selling-plan form route retained.

## Rollback

Frontend previous production commit: d5269c04d621b85bb50f90fc7a5b78c2a7477f70.
Revert this release commit and deploy through the existing GitHub/Vercel workflow.
Set starter product back to Draft and deactivate discount 1539478388810.
Reactivate old bottle rule 1446081101898 with its original no-end-date setting.
Remove the new $50 standard free-shipping threshold, retaining the original $5
standard / $12 express rates. Keep all existing subscription rules intact.
Do not uninstall Bundles automatically; the owner approved its use.

## Limits

No payment/order submission or fulfillment run. Payment-provider completion,
Apple Pay device-specific behavior and every tax jurisdiction cannot be verified
without those environments. Guest and returning checkout totals were inspected.

## October 15 compact-offer repair

Owner screenshot showed a successfully added kit with an $83.97 line price and red component-value text; the $33.97 discount and $50 total were below. No failing cart API request was involved: Add starter kit calls the local CartContext, and Shopify is contacted at checkout. Cart presentation now includes the kit discount in its line price and displayed subtotal, so one kit reads $50 without subtracting the discount twice. Competing-discount logic and Shopify configuration are unchanged.

Reused the prior complete-kit visual language and 52px real product thumbnails. Section is approximately 136px high at desktop buy-box width and 221px at 390px mobile viewport, instead of roughly 700px. Detailed terms sit in an accessible disclosure. Removed promotional expiration copy per owner's instruction; packaging imagery untouched. Brief add feedback and a synchronous duplicate-click guard prevent accidental double adds.

Validation: production build; 14 pricing/display assertions; local real-button fresh add $50; quantity increase $100; repeated later add $150; decrease; mixed cart one kit plus one pouch $81.99; reload persistence; mobile and desktop visual inspection. No checkout route, Shopify price, discount, shipping, inventory or subscription changes in this repair.

Repair rollback: revert this repair commit to restore production merge be0e02dc95285ea7228866856bea980a536c63d3. Shopify needs no rollback for this repair.
