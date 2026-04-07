# Shopify + Klaviyo Integration Setup — Atlas Hydration

## 1. Install Klaviyo on Shopify

1. Go to **Shopify Admin → Apps → Search "Klaviyo"**
2. Install the Klaviyo app
3. Log into your Klaviyo account when prompted
4. Klaviyo will automatically sync:
   - Product catalog
   - Existing customers
   - Tracking events: Viewed Product, Added to Cart, Started Checkout, Placed Order, Fulfilled Order, Cancelled Order, Refunded Order
5. Verify: **Klaviyo → Integrations → Shopify** should show "Connected"

## 2. Set Up Klaviyo Signup Forms

1. **Klaviyo → Sign-up Forms → Create**
2. Build a popup form
3. Collect: Email (required), First Name (optional)
4. Connect to list: **"Atlas Newsletter"** (create this list)
5. Offer: "Get 10% off your first order" with code WELCOME10
6. Display rules: Show after 5 seconds, don't show to existing subscribers
7. This list triggers the Welcome Series flow

## 3. Create Discount Codes in Shopify

| Code | Discount | Usage | Expiry |
|------|----------|-------|--------|
| WELCOME10 | 10% off entire order | One use per customer | No expiry |
| COMEBACK15 | 15% off entire order | One use per customer | No expiry |

**Shopify Admin → Discounts → Create Discount** for each code.

## 4. DNS and Sending Domain Setup

1. **Klaviyo → Settings → Email → Sending Domains**
2. Add: `atlas-hydration.com`
3. Add the DNS records Klaviyo provides:
   - **DKIM** — CNAME record
   - **SPF** — TXT record
   - **Custom Return-Path** — CNAME record
4. Verify in Klaviyo (may take up to 48 hours for DNS propagation)
5. This ensures emails come from `@atlas-hydration.com`

## 5. Deploy Email Templates

```bash
# Set your Klaviyo Private API Key
export KLAVIYO_API_KEY=pk_your_private_key_here

# Dry run first (no API calls, just validates files)
node scripts/deploy-klaviyo.js --dry-run

# Deploy all 14 templates
node scripts/deploy-klaviyo.js

# Deploy and test render
node scripts/deploy-klaviyo.js --test-render
```

Get your API key from: **Klaviyo → Settings → API Keys → Create Private API Key**
Required scopes: `templates:read`, `templates:write`

## 6. Create Flows in Klaviyo

See `docs/klaviyo-flow-setup.md` for detailed flow creation instructions.

## 7. Pre-Launch Checklist

- [ ] Klaviyo account created (free up to 250 contacts)
- [ ] Shopify ↔ Klaviyo integration installed and connected
- [ ] Sending domain (atlas-hydration.com) verified with DKIM/SPF
- [ ] All 14 templates uploaded via deploy script
- [ ] Welcome Series flow created and set to LIVE
- [ ] Abandoned Cart flow created and set to LIVE
- [ ] Post-Purchase flow created and set to LIVE
- [ ] Winback flow set to DRAFT (enable after 30+ day old customers exist)
- [ ] Signup form created and active
- [ ] Discount codes WELCOME10 and COMEBACK15 created in Shopify
- [ ] Test email sent to yourself for each flow
- [ ] Physical mailing address added in Klaviyo → Settings → Account
- [ ] Unsubscribe page customized with Atlas branding

## 8. Monitoring

After launch, monitor in **Klaviyo → Analytics → Flows**:
- Welcome Series: target 40%+ open rate, 3%+ click rate
- Abandoned Cart: target 45%+ open rate, 5%+ click rate
- Post-Purchase: target 50%+ open rate
- Winback: target 25%+ open rate
