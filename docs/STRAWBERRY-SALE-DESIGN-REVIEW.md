# Strawberry sale landing-page review

Local design draft only. Not published, no cart calls, and no changes to live pricing.

## Preview
- Start `ATLAS_SALE_PREVIEW=true npm run dev -- --port 3001` for a sale-first homepage at http://localhost:3001/.
- The design is also available at http://localhost:3001/sale-preview in development.
- Production renders the existing homepage and returns not-found for the preview route. No environment flag can activate this sale in production.

## Design
Warm off-white, charcoal and strawberry red. Full original Shopify product photograph, unaltered and uncropped. The offer leads the homepage: five pouches, $50, 80 sticks, free standard shipping. A secondary two-pouch card shows $32, 32 sticks and free standard shipping. The short date appears in the hero and both bundle cards before disabled purchase controls. No invented deadline, warehouse story, inventory scarcity, or nutrition changes.

## Release gates
1. Verify the exact printed label for January 1, 2027: expiration versus best-before remains unconfirmed. Interim draft says “This batch is short-dated: January 1, 2027.” Photo inspected does not show the date label.
2. Shopify must return exactly $50 for five and $32 for two with free standard shipping for both bundles. Test one-time only, subscriptions, welcome codes, existing automatic discounts, mixed flavors, quantities 1–10 and bottle/starter-kit interactions.
3. Reconcile shared announcement bar, existing buy box, cart, signup offer and PDP. This preview intentionally does not connect sale buttons to the existing pricing/cart, which still uses previous offers.
4. Confirm shipping markets, taxes, offer scheduling and quantity behavior. No end date invented.
5. Complete desktop/mobile visual review with the actual browser and owner approval. Then explicitly implement production cart integration and approve publication. A design preview is not approval to deploy.

Existing uncommitted components and styles were preserved. Only app/page.tsx received a small local-only gate; sale component, CSS module, preview route, test and this document are additive.
