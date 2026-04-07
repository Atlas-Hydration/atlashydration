# Atlas Hydration — Email Marketing System

Complete email marketing automation for Atlas Hydration. 14 standalone HTML emails across 4 automated flows, designed for Klaviyo (or any ESP that supports Jinja/Django-style template variables).

## Product Data Reference

| Field | Value |
|-------|-------|
| Brand | Atlas Hydration |
| Electrolytes | 1,769mg per serving |
| Sugar | 0g |
| Calories | 0 |
| Flavors | Grapefruit, Mixed Berry, Strawberry Lemonade, Lemon Lime |
| Pack Size | 16 stick packs per box |
| Key Ingredients | Sodium, Potassium, Magnesium, Vitamin C, B6 (P5P), B12 (Methylcobalamin), Niacin (B3), Pantothenic Acid (B5), L-Glutamine |
| Promo | Buy 3 Get 1 Free |
| Domain | atlas-hydration.com |
| Support | support@atlas-hydration.com |

## Directory Structure

```
src/emails/
├── README.md
├── welcome/
│   ├── email-01-welcome.html
│   ├── email-02-origin-story.html
│   ├── email-03-sugar-comparison.html
│   ├── email-04-social-proof.html
│   └── email-05-urgency-discount.html
├── abandoned-cart/
│   ├── email-06-cart-reminder.html
│   ├── email-07-social-proof-cart.html
│   └── email-08-final-cart.html
├── post-purchase/
│   ├── email-09-order-confirmation.html
│   ├── email-10-usage-guide.html
│   └── email-11-review-request.html
└── winback/
    ├── email-12-miss-you.html
    ├── email-13-whats-new.html
    └── email-14-final-offer.html
```

## Email Flows

### Flow 1: Welcome Series (5 emails)

Triggered when a new subscriber joins the email list (popup signup, footer form, or checkout opt-in).

| # | File | Subject | Delay | Purpose |
|---|------|---------|-------|---------|
| 01 | `welcome/email-01-welcome.html` | Welcome to Atlas — here is what you need to know | Immediate | Brand intro, key benefits, first CTA |
| 02 | `welcome/email-02-origin-story.html` | Why a pilot built an electrolyte brand | +1 day | Founder story, emotional connection |
| 03 | `welcome/email-03-sugar-comparison.html` | 11 grams of sugar — and that is the 'healthy' option | +2 days | Competitor comparison, education |
| 04 | `welcome/email-04-social-proof.html` | Do not take our word for it | +3 days | Reviews, testimonials, certifications |
| 05 | `welcome/email-05-urgency-discount.html` | Your 10% off expires in 24 hours | +4 days | Urgency, final welcome offer |

**Recommended Klaviyo setup:**
- Trigger: List subscription (Welcome List)
- Smart sending: 16 hours
- Exit condition: Places order (move to post-purchase flow)

### Flow 2: Abandoned Cart (3 emails)

Triggered when a customer adds items to cart but does not complete checkout.

| # | File | Subject | Delay | Purpose |
|---|------|---------|-------|---------|
| 06 | `abandoned-cart/email-06-cart-reminder.html` | You left something behind | +1 hour | Simple reminder |
| 07 | `abandoned-cart/email-07-social-proof-cart.html` | Here is why they switched | +24 hours | Social proof + comparison |
| 08 | `abandoned-cart/email-08-final-cart.html` | Your cart is about to expire | +48 hours | Final urgency push |

**Recommended Klaviyo setup:**
- Trigger: Checkout Started (or Added to Cart)
- Filter: Has not placed order since starting flow
- Smart sending: Off (time-sensitive)
- Exit condition: Places order

### Flow 3: Post-Purchase (3 emails)

Triggered after a customer completes their first order.

| # | File | Subject | Delay | Purpose |
|---|------|---------|-------|---------|
| 09 | `post-purchase/email-09-order-confirmation.html` | Your Atlas is on the way | Immediate | Order confirmation, usage tips |
| 10 | `post-purchase/email-10-usage-guide.html` | Get the most out of your Atlas | +3 days | Usage guide, 5 optimal times |
| 11 | `post-purchase/email-11-review-request.html` | How are you liking Atlas? | +14 days | Review request + reorder CTA |

**Recommended Klaviyo setup:**
- Trigger: Placed Order (first time)
- Smart sending: 16 hours
- Conditional split after Email 11: If ordered again, suppress winback flow

### Flow 4: Winback (3 emails)

Triggered when a previous customer has not purchased in 60+ days.

| # | File | Subject | Delay | Purpose |
|---|------|---------|-------|---------|
| 12 | `winback/email-12-miss-you.html` | We miss you, {{ first_name\|default:'friend' }} | Immediate | Gentle re-engagement |
| 13 | `winback/email-13-whats-new.html` | Here is what you have been missing | +3 days | Product updates, comparison refresh |
| 14 | `winback/email-14-final-offer.html` | Your exclusive offer — 15% off to come back | +7 days | Best discount, last attempt |

**Recommended Klaviyo setup:**
- Trigger: Metric — Placed Order (date is at least 60 days ago)
- Filter: Has not placed order in last 60 days
- Smart sending: 16 hours
- Exit condition: Places order or unsubscribes

## Template Variables (Klaviyo / Jinja)

These variables are used across emails and should be configured in your ESP:

| Variable | Used In | Description | Default |
|----------|---------|-------------|---------|
| `{{ first_name }}` | Emails 09, 12 | Customer first name | `'explorer'` (Email 09), `'friend'` (Email 12) |
| `{{ discount_code }}` | Email 05 | Welcome discount code | `WELCOME10` |
| `{{ winback_code }}` | Email 14 | Winback discount code | `COMEBACK15` |
| `{{ checkout_url }}` | Emails 06, 07, 08 | Abandoned cart checkout URL | `https://atlas-hydration.com` |
| `{{ tracking_url }}` | Email 09 | Order tracking URL | `https://atlas-hydration.com` |
| `{% unsubscribe %}` | All emails (footer) | ESP unsubscribe link | Handled by ESP |

## Design System

All emails follow a consistent design system:

- **Max width:** 600px, centered on `#f0f0f0` background
- **Layout:** Table-based for maximum email client compatibility
- **Styles:** 100% inline (no external CSS except Google Fonts import)
- **Responsive:** CSS media query at 600px breakpoint adjusts padding
- **Primary font:** Montserrat (with Helvetica/sans-serif fallback)
- **Headline font:** Georgia (serif fallback)
- **Monospace accents:** Courier New (eyebrow text, domain display)
- **Primary color (CTA):** `#c0392b` (red)
- **Dark background:** `#0a0a0a`
- **Light background:** `#f5f5f5`
- **Body background:** `#ffffff`

### Block Types

1. **Header** — Dark bar with "ATLAS" wordmark and domain, red bottom border
2. **Hero (Dark)** — `#0a0a0a` background, red eyebrow, cream headline, gray subheadline
3. **Hero (Light)** — `#f5f5f5` background, red eyebrow, dark headline, gray subheadline
4. **Body** — White background, 16px body copy, 1.8 line height
5. **CTA** — Dark background, red button, gray subtext
6. **Footer** — Dark background, brand name, tagline, legal links, copyright

## Setup Instructions

### Klaviyo Setup

1. **Create flows** in Klaviyo for each of the 4 sequences (Welcome, Abandoned Cart, Post-Purchase, Winback)
2. **Copy HTML** from each email file into the corresponding Klaviyo email template (use the HTML/code editor, not the drag-and-drop builder)
3. **Configure triggers** as documented in the flow tables above
4. **Set delays** between emails as specified
5. **Create discount codes** in Shopify:
   - `WELCOME10` — 10% off, single use per customer
   - `COMEBACK15` — 15% off, single use per customer
6. **Test variables** — Send test emails to verify `{{ first_name }}`, `{{ checkout_url }}`, and `{{ tracking_url }}` populate correctly
7. **Enable flows** — Start with Welcome Series, then activate remaining flows

### Other ESP Setup (Mailchimp, Sendgrid, etc.)

1. Replace Klaviyo-specific template syntax (`{{ variable|default:"value" }}`) with your ESP's equivalent merge tag syntax
2. Replace `{% unsubscribe %}` with your ESP's unsubscribe URL tag
3. Upload each HTML file as a custom template
4. Configure automation triggers to match the flow specifications above

### Testing Checklist

- [ ] All emails render correctly in Gmail, Outlook, Apple Mail, and Yahoo
- [ ] Responsive layout works on mobile (< 600px)
- [ ] All links point to correct URLs
- [ ] Template variables populate with test data
- [ ] Unsubscribe link works
- [ ] Preheader text displays correctly in inbox preview
- [ ] Discount codes are active in Shopify
- [ ] Flow triggers fire on correct events
- [ ] Delays between emails are configured correctly
- [ ] Exit conditions prevent duplicate sends

## Email Client Compatibility

These emails are built with maximum compatibility in mind:

- **Table-based layout** — Works in Outlook 2007-2021, Outlook.com, Gmail, Yahoo, Apple Mail
- **Inline styles** — No reliance on `<style>` block (except responsive media query)
- **MSO conditional** — Google Fonts import wrapped in `<!--[if !mso]>` to prevent Outlook issues
- **role="presentation"** — All tables marked as presentational for screen readers
- **Preheader hack** — Hidden div with `&#847;` whitespace characters to control inbox preview text
