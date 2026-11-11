# Warehouse closeout storefront

## State
Release activated after backend and local production QA. `CLOSEOUT_LIVE` is true with verified inventory-linked bundle variants. Live publication was explicitly approved; the exact remote commit and public deployment must be verified after the push.

The original Starter Kit, Grapefruit, signup-navigation fixes, and Strawberry design draft remain intact. Original index/staged state was not reset. The new design is additive in `WarehouseCloseout.tsx` and its CSS module.

## Local preview
`ATLAS_CLOSEOUT_PREVIEW=true npm run dev -- --port 3001` previews the sale on the homepage. `/closeout-preview` is also available in development. Purchase controls remain disabled. Both preview routes return not-found in production.

## Design and behavior
- Warm white, charcoal, muted strawberry and sage. Original approved Shopify photo, uncropped and unaltered.
- 5 pouches / 80 sticks / $50 / $10 per pouch. Secondary 2 pouches / 32 sticks / $32 / $16 per pouch.
- Single radio selection drives the desktop purchase control, order summary, and mobile sticky purchase control. Keyboard selection supported.
- Direct checkout uses one actual Shopify bundle variant, not five or two units of the bundle. It preserves the existing consent-aware attribution helper and adds shipping code `ATLAS-CLOSEOUT-SHIP` only for the two-pouch offer. The five-pouch offer receives free standard shipping at the existing $50 threshold.
- The bundle checks out separately from the customer's existing local bag. A note says so if that bag contains items. The existing normal cart and its Starter Kit/subscription math are unchanged.
- Repeated-click protection, checkout-opening feedback, failure feedback, and browser Back restoration.
- On activation, coordinated navigation, product-page sale callout, shipping policy note, search/social metadata, and welcome-offer exclusions. Automatic signup prompts do not interrupt the sale.
- No expiry/date references, warehouse-relocation story, fabricated stock counts, countdown or sales velocity claims in the new sale experience.

## Verified locally
- TypeScript no-emit check passed.
- Final production build passed. HTTP smoke tests: homepage, Strawberry PDP, Grapefruit PDP and shipping returned 200; both private preview routes returned 404, and the active sale was present with correct title and offer metadata.
- Existing Grapefruit, selected-offer, Starter Kit pricing, signup navigation, legacy preview isolation, and checkout-attribution suites passed.
- New `tests/warehouse-closeout.cjs` covers variant/quantity routing, shipping-code transport, attribution retention, 5/2 selection and sticky parity, double-click protection, Back recovery, and production/preview gates.
- Browser desktop and 390px phone review passed. The photo loaded, no horizontal overflow was observed, and the radio selection updated both purchase controls.
- Keyboard Up changed 2 to 5. FAQ open/close and bag open/Escape dismissal passed.
- A 320px narrow-phone pass showed no horizontal overflow. Both real purchase controls were tested after activation through the final payment step, including Back and switching offers.
- `git diff --check` passed.
- Lint did not run: the pre-existing package script invokes `next lint`, removed in Next 16. No ESLint dependency/config is installed. This is distinct from the passing TypeScript and production-build checks.

## Checkout verification
- Five-pouch variant: `67946324754506`; two-pouch variant: `67946326261834`. Both inventory-linked bundles are Unlisted and available to the Online Store channel.
- Five pouches: $50 with free Standard U.S. shipping, without a shipping code. Two pouches: $32 with Standard shipping discounted from $5 to free by `ATLAS-CLOSEOUT-SHIP`.
- Backend verified mixed bundles at $82, two two-pouch bundles at $64, and two five-pouch bundles at $100, all with free Standard U.S. shipping.
- An ordinary single pouch remained $36.99 including $5 Standard shipping. Express remained $12, making a two-pouch order $44 when selected.
- Both automatic product discounts exclude order-discount combinations. HYDRATE was rejected for the test account because it was outside the eligible segment; an eligible-customer stacking test was not performed.
- Exact two-to-five cross-flow passed with no residual shipping-code warning. Local production UI five-to-two-to-five clicks also passed through payment-step totals and shipping. No orders were placed.

## Publication and rollback
Publish through the existing GitHub main / Vercel pipeline, then verify the exact remote commit, deployment status, public homepage desktop/mobile layout, both purchase paths, ordinary product pages, and private preview 404s before launching email.

To stop the storefront promotion, set `CLOSEOUT_LIVE` to false and redeploy. This restores the original home and navigation while preserving product fixes. Coordinate Shopify discount changes separately. The previous public main commit was `953388d4843d6386fbdecec881f2e82ed0c64e7d`.

## Repository
Original working branch: `codex/starter-selection-consistency`, preserved with its prior staged/unstaged work. A separate release worktree uses `codex/warehouse-closeout-20261111`. Preparation commit: `1df0c5e68c74667c9fd93315b0427a3ec9b99916`.

GitHub main was verified unchanged at `953388d4843d6386fbdecec881f2e82ed0c64e7d` immediately before publication. GitHub remote: `https://github.com/Atlas-Hydration/atlashydration.git`.
