# Atlas Hydration pricing: source of truth

**Shopify checkout is authoritative.** The storefront only mirrors what Shopify really does so it can show an
expected total. Code lives in `app/data/pricing.ts` (pouch math) and `app/context/CartContext.tsx` (cart totals,
bottle switch). If a rule here stops matching Shopify, fix the code. Never add a storefront-only discount.

## Active offers

| # | Offer | Lives in | Applies to | Exact logic | Stacks? | Customer sees |
|---|---|---|---|---|---|---|
| 1 | Pouch retail | Shopify variant price | Strawberry Lemonade + Grapefruit | $31.99 per 16-stick pouch ($2.00 / stick) | n/a | `$31.99`, paid shipping ($4.99) |
| 2 | **ATLAS2PACK** | Shopify **automatic** product discount | One-time pouches, both flavors | $2.50 off **each** pouch, min 2 pouches (flavors combined), one-time only | Product + shipping discounts OK; order discounts not | 2 = $58.98, 3 = $88.47, 4 = $117.96 (each pouch $29.49). Stock Up shows `$58.98 ~~$63.98~~ Save $5 + free shipping` |
| 3 | Subscribe & Save | Appstle selling plans (2 / 4 / 6 weeks) | Pouches bought as a subscription | 20% off retail = $25.59 per pouch, free shipping. Never combined with ATLAS2PACK | No | `$25.59 ~~$31.99~~` |
| 4 | Free shipping | Shopify shipping rate (threshold) | Whole order | Orders over $40, and all subscriptions. Storefront only *messages* it | n/a | "Free shipping over $40"; 1 pouch pays $4.99 |
| 5 | Welcome code `ATLASWELCOME10` | Shopify discount code, typed by the customer | Order | Shown by the signup popup; the storefront never applies or stacks it | Per Shopify combination settings | Code revealed after signup |
| 6 | Bottle retail | Shopify variant price | Atlas Performance Bottle | $19.99 | n/a | `$19.99` |
| 7 | Bottle 50% off / free | **Must exist in Shopify as an automatic discount** (storefront shows it while `BOTTLE_DISCOUNT_LIVE = true`) | The bottle | 2+ pouches (any mix, subscription included): bottle 50% off (Shopify takes $9.99 off, bottle $10.00). 4+ pouches: bottle free. Must combine with product discounts so it coexists with ATLAS2PACK | With ATLAS2PACK (different products) | Slider (Free Shipping / 50% Off / Free Bottle), "Add Bottle 50% off $9.99" card, bundle = `$68.98 ~~$83.97~~ Save $14.99` |

Storefront sends **no discount code** at checkout. The hidden `discount=` field was removed because ATLAS2PACK is
automatic. The old `ATLAS2PACK-OLD` order discount is not referenced anywhere.

## The bottle promotion depends on Shopify
The storefront shows the bottle slider and prices while `BOTTLE_DISCOUNT_LIVE = true` in `CartContext.tsx`.
Shopify must have matching **automatic** discounts (2 pouches = bottle 50% off, 4 pouches = bottle free) that are set
to combine with product discounts. If a real checkout shows the bottle at full price, set the switch to `false`
and the slider, bottle prices and bundle discount disappear. Verify rows 9, 10 and 10b. Also confirm the exact
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
| 9 | 2 pouches + bottle (Add Bundle) | $68.98 | $68.98 | ATLAS2PACK −$5.00 **and** bottle 50% (−$9.99) | free | | | |
| 10 | 3 pouches + bottle | n/a | $98.47 | ATLAS2PACK −$7.50 and bottle 50% (−$9.99) | free | | | |
| 10b | 4 pouches + bottle | n/a | $117.96 | ATLAS2PACK −$10.00 and bottle free (−$19.99) | free | | | |
| 11 | Subscription only | $25.59 | $25.59 | Appstle 20% | free | | | |
| 12 | Subscription + 1 one-time pouch | n/a | $57.58 | Appstle 20% on the sub; **ATLAS2PACK should NOT apply** | free | | | |
| 13 | 2+ pouch cart, free shipping | see rows 2-4, 6-8 | | | free | | | |
| 14 | Bundle, free shipping | $68.98 | $68.98 | as row 9 | free | | | |
| 15 | Welcome code typed on 1 pouch | n/a | $31.99 | per Shopify code settings | $4.99 | | | |
| 16 | Welcome code typed on 2+ pouch cart | n/a | $58.98 | depends on combination settings (ATLAS2PACK does not combine with order discounts) | free | | | |

Things only your checkout can confirm:
- **Row 12:** the site assumes the subscription item does *not* count toward ATLAS2PACK's 2-item minimum. If Shopify
  counts it, checkout will show an extra −$2.50 on the one-time pouch and the site must be told.
- **Rows 2-4, 6-8:** free shipping at these totals. An earlier 2-pouch checkout showed $5.00 shipping; the Shopify
  free-shipping rate must be "$40 and over".
- **Rows 15-16:** whether `ATLASWELCOME10` is allowed to combine with ATLAS2PACK. The storefront does nothing here.

## Known open issue (2026-09-30)
A live checkout of 2 pouches + bottle showed the bottle discount (−$9.99) and free shipping applied, but **ATLAS2PACK did
not** (pouches $63.98), for a total of $73.98 instead of $68.98. Shopify is applying only one of the two product
discounts: their **Combinations** settings do not allow each other. Both discounts must have "Product discounts" (and
"Shipping discounts") checked. Re-test row 9 after changing it.
