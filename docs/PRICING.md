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
| 7 | Bottle 50% off / free | **Does not exist in Shopify** | none | Display code is switched **off** (`BOTTLE_DISCOUNT_LIVE = false`) | n/a | No bottle promise anywhere. Bundle = `$78.97 ~~$83.97~~ Save $5.00` (2 pouches after ATLAS2PACK + bottle at retail) |

Storefront sends **no discount code** at checkout. The hidden `discount=` field was removed because ATLAS2PACK is
automatic. The old `ATLAS2PACK-OLD` order discount is not referenced anywhere.

## Re-enabling the bottle promotion (later)
1. Create the discount in Shopify and set it to combine with product discounts (so it coexists with ATLAS2PACK).
2. Verify rows 9 and 10 below in real checkouts. Confirm the exact rounded bottle price Shopify returns
   (code assumes 50% of $19.99 rounds to $9.99, i.e. $10.00 off).
3. Only then set `BOTTLE_DISCOUNT_LIVE = true` in `CartContext.tsx`.

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
| 9 | 2 pouches + bottle (Add Bundle) | $78.97 | $78.97 | ATLAS2PACK −$5.00, no bottle discount | free | | | |
| 10 | 3 pouches + bottle | n/a | $108.46 | ATLAS2PACK −$7.50, no bottle discount | free | | | |
| 11 | Subscription only | $25.59 | $25.59 | Appstle 20% | free | | | |
| 12 | Subscription + 1 one-time pouch | n/a | $57.58 | Appstle 20% on the sub; **ATLAS2PACK should NOT apply** | free | | | |
| 13 | 2+ pouch cart, free shipping | see rows 2-4, 6-8 | | | free | | | |
| 14 | Bundle, free shipping | $78.97 | $78.97 | as row 9 | free | | | |
| 15 | Welcome code typed on 1 pouch | n/a | $31.99 | per Shopify code settings | $4.99 | | | |
| 16 | Welcome code typed on 2+ pouch cart | n/a | $58.98 | depends on combination settings (ATLAS2PACK does not combine with order discounts) | free | | | |

Things only your checkout can confirm:
- **Row 12:** the site assumes the subscription item does *not* count toward ATLAS2PACK's 2-item minimum. If Shopify
  counts it, checkout will show an extra −$2.50 on the one-time pouch and the site must be told.
- **Rows 2-4, 6-8:** free shipping at these totals. An earlier 2-pouch checkout showed $5.00 shipping; the Shopify
  free-shipping rate must be "$40 and over".
- **Rows 15-16:** whether `ATLASWELCOME10` is allowed to combine with ATLAS2PACK. The storefront does nothing here.
