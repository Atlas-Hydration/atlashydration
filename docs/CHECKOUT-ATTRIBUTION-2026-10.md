# Starter Kit attribution handoff — October 28, 2026

The one-time cart now uses the store-advertised Shopify UCP `/buy` endpoint,
version 2026-08-25. Shopify's documented `attribution/` parameters carry original
UTM fields and an original fbclid when present. No click ID is fabricated, no
customer fields are copied, and no browser cookies are transplanted across domains.
Campaign context is session-scoped, expires after 24 hours, and is only captured
and forwarded after accepted storefront cookie consent. Declining clears it.

Source: https://shopify.dev/docs/agents/carts-and-checkout/permalinks
Capability verified at https://7fa7b7-42.myshopify.com/.well-known/ucp.

Browser QA before deployment: UCP preserved marked internal-QA UTM parameters in
the checkout URL. One kit was $83.97 less $33.97 = $50; InitiateCheckout was USD 50
with a Shopify event ID and pixel 1949506255832708. No personal data was entered
and no order was submitted. Unlike the legacy `/cart` permalink, this UCP journey
did not emit another Shopify AddToCart. Storefront AddToCart remains for one-time
products, using $50 for a Starter Kit; subscriptions retain the Shopify form flow.
The initial Strawberry ViewContent now describes its default $50 Starter Kit.
Shopify remains the sole InitiateCheckout and Purchase/CAPI implementation.

Run `node scripts/test-checkout-attribution.cjs` and `npm run build`.

Limits: this does not prove historical lost conversions, Purchase deduplication,
or server-side click matching. Mixed subscription carts retain the existing form
handoff and are outside the new Starter Kit campaign. Shopify controls its own
event parameters. Do not interpret raw event counts as unique customers.
