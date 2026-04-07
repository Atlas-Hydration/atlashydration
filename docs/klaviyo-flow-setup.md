# Klaviyo Flow Setup Guide — Atlas Hydration

> This guide walks through creating all 4 email flows in Klaviyo's UI.
> Templates must be uploaded first via `scripts/deploy-klaviyo.js`.

## Prerequisites

- [ ] Klaviyo account created at [klaviyo.com](https://www.klaviyo.com/sign-up)
- [ ] Shopify ↔ Klaviyo integration installed
- [ ] All 14 templates uploaded via deploy script
- [ ] Sending domain verified (atlas-hydration.com)

---

## Flow 1: Welcome Series (5 emails)

**Klaviyo → Flows → Create Flow → Create from Scratch**

| Setting | Value |
|---------|-------|
| Trigger | List trigger — "Atlas Newsletter" list |
| Filter | Has not been in this flow before |

### Email sequence:

| # | Template | Subject | Delay | Preview Text |
|---|----------|---------|-------|--------------|
| 1 | Atlas Welcome 01 | Welcome to Atlas — here is what you need to know | Immediate | Premium electrolytes. Zero sugar. 1,769mg per serving. |
| 2 | Atlas Welcome 02 | Why a pilot built an electrolyte brand | +1 day | 35,000 feet. Dry cabin air. Zero good options. |
| 3 | Atlas Welcome 03 | 11 grams of sugar — and that is the "healthy" option | +2 days (Day 3) | The leading brand has 11g sugar per serving. Atlas has 0. |
| 4 | Atlas Welcome 04 | Do not take our word for it | +2 days (Day 5) | Third-party tested. Keto. Paleo. Gluten-free. Zero junk. |
| 5 | Atlas Welcome 05 | Your 10% off expires in 24 hours | +2 days (Day 7) | Last chance — this code won't last. |

**After Email 5:** Add Conditional Split → "Has Placed Order" → Yes: Exit flow.

---

## Flow 2: Abandoned Cart (3 emails)

**Trigger:** Metric — "Started Checkout" (auto-configured by Shopify integration)

| Setting | Value |
|---------|-------|
| Flow filter | Has NOT placed order since starting this flow |
| Profile filter | Has not received email from this flow in last 7 days |

### Email sequence:

| # | Template | Subject | Delay | Preview Text |
|---|----------|---------|-------|--------------|
| 6 | Atlas Cart 01 | You left something behind | +1 hour | Your Atlas is still waiting. |
| 7 | Atlas Cart 02 | Here is why they come back | +23 hours (Day 1) | See why thousands choose Atlas. |
| 8 | Atlas Cart 03 | Last chance — your cart expires soon | +24 hours (Day 2) | We saved your cart, but not for long. |

**Between each email:** Add Conditional Split → "Has Placed Order" → Yes: Exit flow.

---

## Flow 3: Post-Purchase (3 emails)

**Trigger:** Metric — "Placed Order" (auto-configured by Shopify integration)

| # | Template | Subject | Delay | Preview Text |
|---|----------|---------|-------|--------------|
| 9 | Atlas Post-Purchase 01 | Your Atlas is on the way | Immediate | Here's what to expect + how to use Atlas. |
| 10 | Atlas Post-Purchase 02 | Get the most out of your Atlas | +5 days | 5 best times to drink Atlas for maximum results. |
| 11 | Atlas Post-Purchase 03 | How are you liking Atlas? | +9 days (Day 14) | Your feedback helps us — and helps others find cleaner hydration. |

---

## Flow 4: Winback (3 emails)

**Trigger:** Segment — Create segment with these conditions:
- Has placed order at least 1 time (over all time)
- Has NOT placed order in the last 30 days
- Has NOT been in this flow in the last 90 days

| # | Template | Subject | Delay | Preview Text |
|---|----------|---------|-------|--------------|
| 12 | Atlas Winback 01 | We miss you, {{ first_name\|default:"friend" }} | Immediate | It's been a while. Atlas is still here for you. |
| 13 | Atlas Winback 02 | Here is what you have been missing | +15 days (Day 45) | New flavors, same premium formula. |
| 14 | Atlas Winback 03 | Your exclusive offer — 15% off to come back | +15 days (Day 60) | 15% off. Just for you. Limited time. |

**Note:** Keep this flow in DRAFT until you have customers with 30+ days since last purchase.

---

## Klaviyo Variables Used

| Variable | Description | Used In |
|----------|-------------|---------|
| `{{ first_name\|default:"there" }}` | Customer first name | Emails 12, 14 |
| `{{ discount_code\|default:"WELCOME10" }}` | Welcome discount code | Email 5 |
| `{{ winback_code\|default:"COMEBACK15" }}` | Winback discount code | Email 14 |
| `{{ checkout_url }}` | Cart recovery URL | Emails 6, 7, 8 |
| `{{ tracking_url }}` | Order tracking URL | Email 9 |
| `{% unsubscribe %}` | Unsubscribe link | All emails (footer) |

---

## After Setup

1. Set all flows to **LIVE** (except Winback — set to DRAFT initially)
2. Send a test email to yourself from each flow
3. Monitor Klaviyo Analytics → Flows for open rates and click rates
4. Target benchmarks: 40%+ open rate, 3%+ click rate for Welcome series
