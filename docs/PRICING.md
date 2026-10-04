# Atlas Hydration pricing: source of truth

**Shopify checkout is authoritative.** The storefront only mirrors what Shopify really does so it can show an
expected total. Code lives in `app/data/pricing.ts` (pouch math) and `app/context/CartContext.tsx` (cart totals,
bottle switch). If a rule here stops matching Shopify, fix the code. Never add a storefront-only discount.

## Active offers

| # | Offer | Lives in | Applies to | Exact logic | Stacks? | Customer sees |
|---|---|---|---|---|---|---|
| 1 | Pouch retail | Shopify variant price | Strawberry Lemonade + Grapefruit | $31.99 per 16-stick pouch ($2.00 / stick) | n/a | `$31.99`, paid shipping ($4.99) |
| 2 | **ATLAS2PACK** | Shopify **automatic** product discount | One-time pouches, both flavors | $2.50 off **each** pouch, min 2 pouches (flavors combined), one-time only | **Shopify will not apply it together with a bottle discount** (see below) | 2 = $58.98, 3 = $88.47, 4 = $117.96 (each pouch $29.49). Stock Up shows `$58.98 ~~$63.98~~ Save $5 + free shipping` |
| 3 | Subscribe & Save | Appstle selling plans (2 / 4 / 6 weeks) | Pouches bought as a subscription | 20% off retail = $25.59 per pouch, free shipping. Never combined with ATLAS2PACK | No | `$25.59 ~~$31.99~~` |
| 4 | Free shipping | Shopify shipping rate (threshold) | Whole order | Orders over $40, and all subscriptions. Storefront only *messages* it | n/a | "Free shipping over $40"; 1 pouch pays $4.99 |
| 5 | Welcome code `ATLASWELCOME10` | Shopify discount code, typed by the customer | Order | Shown by the signup popup; the storefront never applies or stacks it | Per Shopify combination settings | Code revealed after signup |
| 6 | Bottle retail | Shopify variant price | Atlas Performance Bottle | $19.99 | n/a | `$19.99` |
| 7 | Bottle 50% off / free | Shopify, two automatic Buy X Get Y discounts ("Buy 2 Pack Get 50% off Bottle", "Buy 4 Pouches Get Free Bottle"), one-time purchases only | The bottle | 2+ one-time pouches: bottle 50% off (Shopify takes $9.99 off, bottle $10.00). 4+ one-time pouches: bottle free | **Not with ATLAS2PACK**: on one order Shopify applies only the larger of the two | Slider (Free Shipping / 50% Off / Free Bottle), "Add Bottle 50% off $10.00" card, bundle = `$73.98 ~~$83.97~~ Save $9.99` |

Storefront sends **no discount code** at checkout. The hidden `discount=` field was removed because ATLAS2PACK is
automatic. The old `ATLAS2PACK-OLD` order discount is not referenced anywhere.

## The bottle promotion depends on Shopify
The storefront shows the bottle slider and prices while `BOTTLE_DISCOUNT_LIVE = true` in `CartContext.tsx`.
Shopify has the two matching **automatic** discounts (2 pouches = bottle 50% off, 4 pouches = bottle free). If a real
checkout ever shows the bottle at full price, set the switch to `false` and the slider, bottle prices and bundle
discount disappear. Verify rows 9, 10 and 10b. Also confirm the exact
rounded bottle price Shopify returns. Confirmed in a live checkout on 2026-09-30: 50% of $19.99 is taken as **$9.99 off**, so the bottle is $10.00.

## Checkout QA matrix
"Site" columns are verified automatically. **Fill in the Shopify columns from a real checkout** (stop at the payment
step, no need to pay). They must match.

| # | Cart | Site display total | Site cart total | Expected discounts | Expected shipping | **Shopify checkout total** | **Discounts shown** | **Shipping** |
|---|---|---|---|---|---|---|---|---|
| 1 | 1 Strawberry | $31.99 | $31.99 | none | $4.99 (paid) | | | |
| 2 | 2 Strawberry | $58.98 | $58.98 | ATLAS2PACK −$5.00 | free | | | |
| 3 | 3 Strawberry | $88.47 | $88.47 | ATLAS2PACK −$7.50 | free | | | |
| 4 | 4 Strawberry | $117.96 | $117.96 | ATLAS2PACK −$10.00 | free | | | |
| 5 | 1 Grapefruit | $31.99 | $31.99 | none | $4.99 (paid) | | | |
| 6 | 2 Grapefruit | $58.98 | $58.98 | ATLAS2PACK −$5.00 | free | | | |
| 7 | 1 Strawberry + 1 Grapefruit | n/a (two pages) | $58.98 | ATLAS2PACK −$5.00 | free | | | |
| 8 | 2 Strawberry + 1 Grapefruit | n/a | $88.47 | ATLAS2PACK −$7.50 | free | | | |
| 9 | 2 pouches + bottle (Add Bundle) | $73.98 | $73.98 | bottle 50% (−$9.99) only, no ATLAS2PACK. **Matches the real checkout on 2026-09-30** | free | | | |
| 10 | 3 pouches + bottle | n/a | $105.97 | bottle 50% (−$9.99) only (larger than ATLAS2PACK −$7.50) | free | | | |
| 10b | 4 pouches + bottle | n/a | $127.96 | bottle free (−$19.99) only (larger than ATLAS2PACK −$10.00) | free | | | |
| 11 | Subscription only | $25.59 | $25.59 | Appstle 20% | free | | | |
| 12 | Subscription + 1 one-time pouch (subscription does not count toward bottle tiers) | n/a | $57.58 | Appstle 20% on the sub; **ATLAS2PACK should NOT apply** | free | | | |
| 13 | 2+ pouch cart, free shipping | see rows 2-4, 6-8 | | | free | | | |
| 14 | Bundle, free shipping | $73.98 | $73.98 | as row 9 | free | | | |
| 15 | Welcome code typed on 1 pouch | n/a | $31.99 | per Shopify code settings | $4.99 | | | |
| 16 | Welcome code typed on 2+ pouch cart | n/a | $58.98 | depends on combination settings (ATLAS2PACK does not combine with order discounts) | free | | | |

Things only your checkout can confirm:
- **Row 12:** the site assumes the subscription item does *not* count toward ATLAS2PACK's 2-item minimum. If Shopify
  counts it, checkout will show an extra −$2.50 on the one-time pouch and the site must be told.
- **Rows 2-4, 6-8:** free shipping at these totals. An earlier 2-pouch checkout showed $5.00 shipping; the Shopify
  free-shipping rate must be "$40 and over".
- **Rows 15-16:** whether `ATLASWELCOME10` is allowed to combine with ATLAS2PACK. The storefront does nothing here.

## Platform rule, confirmed in real checkouts (2026-09-30)
- 2 pouches alone: ATLAS2PACK −$5.00 applied, total $58.98.
- 2 pouches + bottle: only the bottle discount (−$9.99) applied, ATLAS2PACK did not, total $73.98.

Shopify does not apply ATLAS2PACK and a bottle discount on the same order, even with "Product discounts" checked on
both. It gives the customer the larger one. The storefront (`computeCartPricing` in `CartContext.tsx`) mirrors that:
the drawer, the bundle card and the tags show only the larger discount. Rows 10 and 10b assume the same "larger wins"
behavior and still need a real checkout to confirm. Stacking both would need a Shopify-side change (for example a
custom discount function), which the storefront cannot do.

## Every buy button shares one selection

All add-to-cart buttons read one selection (flavor, offer, quantity, subscription frequency, bottle add-on) from `app/context/PurchaseSelectionContext.tsx`, and submit the lines from `purchaseLines()` in `app/data/purchase.ts`:

- **Home page:** main Add to Cart, sticky bar, bottom Order button.
- **Product pages:** main Add to Cart, bottom Order button, mobile sticky bar (768px and below only).

Do not give a button its own hard-coded product or quantity; it will drift from what the buy box shows (this happened once: the home sticky and bottom buttons always added one pouch).

Rules the shared code enforces:
- Purchase type is carried only by `subscriptionFrequency`. A line with it gets an Appstle selling plan at checkout; a one-time line never carries one.
- Repeating the identical add within 1.2 seconds is ignored (double-click). A different selection, or the same one later, is a real choice and adds.
- Checkout ignores a second click within 4 seconds, so the cart is not posted to Shopify twice.
- Reload and Back/Forward restore the shopper's choices for that tab (sessionStorage, per page). A fresh visit (link, ad, typed URL) always starts from the page's own offer.

### 2-pouch landing URL

`/products/strawberry-lemonade/2-pack` opens the product page prerendered with **Strawberry Lemonade, 2 pouches (32 sticks), one-time purchase** selected: $58.98 expected total ($63.98 minus ATLAS2PACK $5.00), free shipping. Opening it adds nothing to the cart and never selects a subscription. Query strings (`utm_*`, `fbclid`, ...) are left alone. Its canonical URL is the main product page, and it is not in the sitemap. Shopify decides the real discount and shipping at checkout.

## Free shipping: what is and is not verified

- Configured threshold: `FREE_SHIPPING_THRESHOLD` = $40 in `app/data/formula.ts` (one number; `public/llms.txt` is static text and must be edited by hand). Subscriptions always ship free.
- **Not verified against Shopify admin.** This repo cannot see the shipping rate. The earlier copy said "over $50" (April to Sep 29, 2026); it became $40 in the pricing passes of Sep 29-30. The Shopify rate must be checked: Settings, Shipping and delivery, the U.S. rate's price condition, plus any automatic free-shipping discount. Note whether it is "$40 and over" or "over $40", and whether it uses the price before or after discounts.
- An earlier real 2-pouch checkout showed **$5.00 shipping** (see the QA notes above). If the rate were $40 or $50 that checkout would have been free, so either the rate was different then or it has since been fixed. Confirm with a fresh checkout of the 2-pack landing offer up to the shipping step (no order needed): shipping must read $0.00.
- `node scripts/check-shipping-boundary.mjs` shows that at current prices no one-time cart totals exactly $40.00, and no cart's free-shipping answer differs between a $40 and a $50 threshold (carts are either under $40: 1 pouch $31.99, 1 or 2 bottles; or $51.98 and up). So ">=" vs "over", and price before vs after discounts, do not change any outcome today. The unexplained $5.00 checkout above is the open question, not the boundary.

## Shopify-side checks only the store owner can run (no order needed)

These cannot be checked from the repo or its tests. The site's request to Shopify was captured and checked (correct variant, quantity, no `selling_plan` on one-time lines), but Shopify's own response was never seen.

1. **2-pack landing offer, shipping step.** Open `/products/strawberry-lemonade/2-pack`, add to cart, check out as far as the shipping options. Expected: 2 x Strawberry Lemonade, one-time, discount "ATLAS2PACK" -$5.00, subtotal $58.98, shipping $0.00. If shipping is not free, the Shopify free-shipping rate or discount is the thing to fix (see "Free shipping" above).
2. **Repeated checkout attempts.** The site posts the cart to Shopify's `/cart/add`, which adds to whatever cart that browser already has at Shopify. In one browser: go to checkout with the 2-pack, press Back, press Checkout again. Expected: still 2 pouches. If it shows 4, a returning customer can end up with doubled lines, and the checkout hand-off needs to start from an empty Shopify cart (needs a Shopify-side decision).
3. **Campaign parameters at checkout.** `utm_*` and `fbclid` stay on the site's landing URL but are not sent to Shopify (the form carries items only). If ad attribution inside Shopify or Meta matters, decide how to pass them on (cart attributes, or a Shopify-side setting) and test it. See `docs/MEASUREMENT.md`.
