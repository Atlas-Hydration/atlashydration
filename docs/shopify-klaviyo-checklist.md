# Atlas Hydration — Shopify + Klaviyo Launch Checklist

## Already Done
- [x] Klaviyo account created
- [x] Private API Key generated (Atlas Email Deploy)
- [x] Shopify Messaging automations disabled (all 5 inactive)
- [x] 14 HTML email templates built and merged (PR #109)
- [x] Deployment script created (scripts/deploy-klaviyo.js)

## Klaviyo Template Deployment
- [ ] Add API key to `.env`: `KLAVIYO_API_KEY=pk_xxx`
- [ ] Dry run: `node scripts/deploy-klaviyo.js --dry-run`
- [ ] Deploy: `node scripts/deploy-klaviyo.js`
- [ ] Verify all 14 templates in Klaviyo → Content → Templates

## Shopify Integration
- [ ] Verify Klaviyo Shopify integration: Klaviyo → Integrations → Shopify → Connected
- [ ] Verify tracking events: Viewed Product, Added to Cart, Started Checkout, Placed Order

## Discount Codes (Shopify Admin → Discounts)
- [ ] WELCOME10 — 10% off entire order, one use per customer
- [ ] COMEBACK15 — 15% off entire order, one use per customer

## DNS / Sending Domain
- [ ] Klaviyo → Settings → Email → Domains → Add atlas-hydration.com
- [ ] Add DKIM record (CNAME) to DNS
- [ ] Add SPF record (TXT) to DNS
- [ ] Add custom return-path (CNAME) to DNS
- [ ] Verify domain in Klaviyo (may take up to 48 hours)

## Signup Forms
- [ ] Create popup form in Klaviyo → Sign-up Forms
- [ ] Offer: "Get 10% off your first order" with code WELCOME10
- [ ] Connect to list that triggers Welcome Series flow
- [ ] Set display rules: show after 5 seconds, hide for existing subscribers

## Flows — Go Live
- [ ] Welcome Series: Replace default emails with Atlas templates → Set to LIVE
- [ ] Abandoned Cart: Replace default emails with Atlas templates → Set to LIVE
- [ ] Post-Purchase: Create from scratch with Atlas templates → Set to LIVE
- [ ] Winback: Create from scratch with Atlas templates → Set to DRAFT

## Testing
- [ ] Send test email to yourself for each of the 14 templates
- [ ] Test Welcome flow: subscribe with a test email
- [ ] Test Abandoned Cart: start checkout, don't complete
- [ ] Test Post-Purchase: place a test order
- [ ] Verify emails render correctly in Gmail, Apple Mail, and Outlook

## Final
- [ ] Physical mailing address added in Klaviyo → Settings → Organization
- [ ] Unsubscribe page customized with Atlas branding
- [ ] All flows set to appropriate status (LIVE or DRAFT)
- [ ] Monitor Klaviyo dashboard for first 48 hours after launch
