# Warehouse closeout storefront

## State
Local implementation, not deployed. `CLOSEOUT_LIVE` remains false and bundle variant IDs / shipping code are empty until Shopify verification is complete. The existing site remains the production output.

The original Starter Kit, Grapefruit, signup-navigation fixes, and Strawberry design draft remain intact. Original index/staged state was not reset. The new design is additive in `WarehouseCloseout.tsx` and its CSS module.

## Local preview
`ATLAS_CLOSEOUT_PREVIEW=true npm run dev -- --port 3001` previews the sale on the homepage. `/closeout-preview` is also available in development. Purchase controls remain disabled. Both preview routes return not-found in production.

## Design and behavior
- Warm white, charcoal, muted strawberry and sage. Original approved Shopify photo, uncropped and unaltered.
- 5 pouches / 80 sticks / $50 / $10 per pouch. Secondary 2 pouches / 32 sticks / $32 / $16 per pouch.
- Single radio selection drives the desktop purchase control, order summary, and mobile sticky purchase control. Keyboard selection supported.
- Direct checkout uses one actual Shopify bundle variant, not five or two units of the bundle. It preserves the existing consent-aware attribution helper and transports the verified shipping code.
- The bundle checks out separately from the customer's existing local bag. A note says so if that bag contains items. The existing normal cart and its Starter Kit/subscription math are unchanged.
- Repeated-click protection, checkout-opening feedback, failure feedback, and browser Back restoration.
- On activation, coordinated navigation, product-page sale callout, shipping policy note, search/social metadata, and welcome-offer exclusions. Automatic signup prompts do not interrupt the sale.
- No expiry/date references, warehouse-relocation story, fabricated stock counts, countdown or sales velocity claims in the new sale experience.

## Verified locally
- TypeScript no-emit check passed.
- Final production build passed. HTTP smoke tests: homepage, Strawberry PDP, Grapefruit PDP and shipping returned 200; both private preview routes returned 404, and the sale was absent from the production homepage.
- Existing Grapefruit, selected-offer, Starter Kit pricing, signup navigation, legacy preview isolation, and checkout-attribution suites passed.
- New `tests/warehouse-closeout.cjs` covers variant/quantity routing, shipping-code transport, attribution retention, 5/2 selection and sticky parity, double-click protection, Back recovery, and production/preview gates.
- Browser desktop and 390px phone review passed. The photo loaded, no horizontal overflow was observed, and the radio selection updated both purchase controls.
- Keyboard Up changed 2 to 5. FAQ open/close and bag open/Escape dismissal passed.
- A 320px narrow-phone pass showed no horizontal overflow. Final purchase controls still require post-activation real-checkout QA.
- `git diff --check` passed.
- Lint did not run: the pre-existing package script invokes `next lint`, removed in Next 16. No ESLint dependency/config is installed. This is distinct from the passing TypeScript and production-build checks.

## Release gates
1. Backend must confirm both inventory-linked bundle variants, net totals $50/$32, non-stacking promotional behavior, free standard U.S. shipping, and no unintended subscription.
2. Copy the exact verified variant IDs and shipping code into `app/data/closeoutOffer.ts`. Expected draft variants from backend: 5 = 67946324754506; 2 = 67946326261834. These are not yet marked checkout-ready.
3. Activate only after the backend verification and coordinated release signal. Re-run tests and build with final settings.
4. Review the activated homepage and Strawberry product page on desktop/phone, click each real purchase path, verify Shopify total and shipping, then deploy using the existing GitHub/Vercel workflow.
5. Confirm exact deployed commit and production homepage/checkout before email launch. No payment submission is needed.

## Repository
Working branch: `codex/starter-selection-consistency`.
GitHub main verified at `953388d4843d6386fbdecec881f2e82ed0c64e7d` before release work. This clone's origin points to the October 28 local checkout, whose origin is `https://github.com/Atlas-Hydration/atlashydration.git`.

Preserve unrelated staged/unstaged work when preparing the release. A separate release worktree is preferable to resetting or rewriting this index. No push, commit, or deploy has been performed by this implementation.
