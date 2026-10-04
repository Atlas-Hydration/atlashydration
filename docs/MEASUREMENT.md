# Measurement: what is in the repo, and what is verified

Last reviewed: 2026-10-04. Read this before changing any tracking.

Rules for this area:
- Do **not** add a second Meta Pixel or Conversions API (CAPI) pipeline next to the existing one.
- Do **not** send test or fake `Purchase` events to production.
- Keep the cookie-consent behavior below.
- Never put credentials, customer names/emails/addresses or raw event payloads in screenshots, issues or commits.

## What the headless site does (from the code)

| Area | Behavior | Where |
|---|---|---|
| Consent | GA4 and the automatic Klaviyo script load only after the visitor presses **Accept**. **Decline** (or no choice) loads neither. Stored in `localStorage` as `atlas_cookie_consent`. One exception, unchanged: when a visitor submits the welcome-signup popup, the fallback opens Klaviyo's native form and loads `klaviyo.js` (their own explicit action, and the email POST to Klaviyo is likewise only sent on submit). | `app/components/CookieConsent.tsx`, `app/lib/klaviyo.ts` (`openWelcomeForm`) |
| GA4 | `gtag.js` (`G-J2NYD0S2BR`) loads only after Accept. Events from the site: `add_to_cart` (one per cart line), `begin_checkout`, `sign_up`. They no-op if `gtag` is not loaded. | `CookieConsent.tsx`, `app/context/CartContext.tsx`, `app/lib/welcomeSignup.ts` |
| Klaviyo | `klaviyo.js` loads automatically only after Accept (see the exception in the Consent row). | `app/lib/klaviyo.ts` |
| Meta Pixel / CAPI | **No Meta code exists in this repo** (no `fbq`, no `fbevents.js`, no `connect.facebook.net`, no CAPI route). The Content-Security-Policy in `next.config.ts` and `vercel.json` does not allow Meta hosts in `script-src`, `connect-src` or `img-src`, so a Pixel could not run on atlas-hydration.com pages even if injected. | `next.config.ts`, `vercel.json` |
| Checkout | The site posts the cart to `https://7fa7b7-42.myshopify.com/cart/add` (`return_to=/checkout`). Everything after that, including any Purchase event, happens on Shopify's domain under Shopify's own apps and settings. | `CartContext.tsx` `checkout()` |
| Campaign parameters | Not stripped on the site (the 2-pack landing URL keeps `utm_*`, `fbclid`, etc. through load and interaction). They are **not** forwarded into the Shopify cart: the checkout form sends items only. | tested in QA run |

So any Meta Purchase tracking is configured in Shopify (for example the Facebook & Instagram sales channel, Customer Events / web pixels, and CAPI through that app). It cannot be inspected from the repo.

## Verification status

No Shopify, Meta Business or Events Manager access was available in this session (no connector, no credentials, and the sandbox cannot reach those services). No recent real order evidence was supplied. Nothing below was changed or sent.

| # | Check | Status | Exact blocker | What passes |
|---|---|---|---|---|
| 1 | Purchase **value** matches the real order, using the documented tax/shipping treatment | **Unverified** | Need one recent real order's totals (subtotal after discounts, shipping, tax, total) and the Events Manager details for its Purchase event. Also need the integration's documented basis for `value` (it may be subtotal after discounts, or total including shipping/tax). | Event `value` equals the order amount on the documented basis, to the cent. |
| 2 | **Currency** is USD | **Unverified** | Same Events Manager event details. | `currency` = `USD` on both browser and server events. |
| 3 | Event **name** and **event IDs** | **Unverified** | Same. Seeing parameter *names* (value, currency, event_id) is not enough; the *values* must be read. | Name is exactly `Purchase`; the browser event and the server event for the same order carry the **same** `event_id`. |
| 4 | Browser/CAPI **deduplication** for one purchase | **Unverified** | Events Manager needs to show the same order's browser and server events as one deduplicated purchase. "Still Parsing" in the domain/event diagnostics is inconclusive and is not evidence either way. | One order produces one counted Purchase. Dedup status reads as deduplicated, and total Purchase count for that order is 1. |
| 5 | **Retries / confirmation-page reloads** do not count another purchase | **Unverified** | Needs the same real order's status page reloaded once, then the Purchase count for that order re-read. (No new order may be placed for this.) | Count is still 1 after reloading and after a retry. |

Not evidence, on purpose: Meta later recognizing the domain atlas-hydration.com; earlier observations of which domain Purchase fired on. Neither shows checkout tracking works or fails.

## Runbook for whoever has access

1. Pick **one recent real order**. In Shopify admin note: order total, subtotal after discounts, shipping, tax, currency, placed-at time. Mask the order number and write nothing identifying the customer.
2. In Meta **Events Manager** open the Pixel/dataset, then Overview, then the `Purchase` event for that time. Open the event details and record, for the browser event and the server event: `event_name`, `value`, `currency`, `event_id`, and the dedup status. Do not copy user-data fields (email/phone hashes, IPs).
3. Compare with the table above. Record **Pass**, **Fail** or **Unverified** for each row, with the sanitized numbers beside it.
4. For row 5, reload that order's status page once (never place a new order), wait for Events Manager to refresh, and check the Purchase count for that `event_id` did not increase.
5. If row 3 fails (IDs differ or are missing on one side), the fix belongs in the Shopify/Meta integration settings. Do not add a second pipeline from this repo.

Possible gap to check while there (a question, not a finding): Meta ad-click matching relies on the `_fbc` / `_fbp` cookies and on `fbclid`. Those are set on atlas-hydration.com, while the purchase happens on Shopify's domain and the form POST carries no campaign data. Check in the evidence above whether Purchase events are matched to ads, and whether a Shopify-side attribution setting is needed.
