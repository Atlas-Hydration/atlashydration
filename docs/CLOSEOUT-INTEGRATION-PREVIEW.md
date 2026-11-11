# Additive warehouse closeout preview

Status: additive implementation verified locally and explicitly approved for publication. Publication must be confirmed against the exact remote commit and public deployment. Baseline: rollback commit `5b4c294b0d77620befd03abedf5598cfa0ca656c`.

Preview on Garrett's Mac: http://localhost:3004/ (sale section: http://localhost:3004/#closeout-bundles).
Branch: `codex/integrate-closeout-highlight-20261111`.

## Scope
The original video hero and all 14 original homepage sections remain, in the same order. The existing product pages, cart, purchase selection, footer links, global styles, and page metadata are unchanged. The new sale section is inserted immediately after the original hero. It follows the user's reference image: cream background, charcoal headline, muted red sale line, and the 5-pouch $50 offer.

The only supporting changes are a new first announcement in the existing rotating bar, the welcome discount exclusion for closeout bundles, a standard-shipping policy exception, and hiding the ordinary sticky cart control while the separate sale checkout section is visible. All original announcements and ordinary sticky-cart behavior remain.

## Checkout
One inventory-linked bundle per purchase click. Five pouches use variant `67946324754506` at $50 and the existing free-shipping threshold. Two pouches use variant `67946326261834` at $32 with `ATLAS-CLOSEOUT-SHIP`. Shipping is standard U.S. only. The customer sees that sale bundles check out separately from the existing bag. Attribution remains consent-aware. Other promotional discounts do not combine.

## Verification
- Inspected the actual attached reference image pixels.
- `npm run build`, `npx tsc --noEmit --incremental false`, `git diff --check`: passed.
- `tests/closeout-highlight.cjs`: passed. Includes exact baseline equality for all original homepage sections and key product/cart files, correct bundle quantities and variants, shipping code only for two, selector changes, repeat-click protection, Back restoration, error retry, and preserved announcements.
- `tests/starter-pricing.cjs`: all 14 existing pricing cases passed.
- `scripts/test-checkout-attribution.cjs`: passed.
- Desktop, 390px mobile, and 320px narrow mobile visually checked. No horizontal overflow in the new section; native radio keyboard interaction works. Viewport override reset.
- Real clicks from the preview reached final payment with $32/free Standard shipping and $50/free Standard shipping, including switching two to five without a leftover shipping-code warning. No payment submitted.
- Back restored the sale button. Existing bag opened with empty state, and the catalog link returned to the original product selector.
- Original homepage title, video hero, product selector, reviews, bottle, science, founder, benefits, blog, Grapefruit, FAQ, and final calls to action verified present.
- Homepage, all three product pages, shipping, blog, and contact returned HTTP 200 locally.
- Lint is not available through the existing script: `next lint` was removed in Next 16 and no ESLint configuration is installed. Type checking and build passed separately.

The approved release scope preserves the entire original website and adds the sale feature. The previous takeover design and original unfinished work remain preserved in their original branch/history.
