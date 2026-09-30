# SEO maintenance

Structured data and social metadata are centralized in `app/data/seo.ts`. Shipping and returns markup mirrors the
`/shipping` page (1-2 business days processing, 4-6 days delivery, free over $40, $4.99 under, 30-day returns).
If those policies change, change them there.

## Adding an article
1. Add it to `app/data/articles.ts` (slug, tag, title, dek, cover, takeaways, body, sources). Keep claims hedged and sourced.
2. Generate its share image: `node scripts/generate-og.mjs` (needs Playwright + Chromium; writes `public/og/`).
3. Add its URL to `public/sitemap.xml` and to `public/llms.txt`.
4. Nothing else: the blog index, article page metadata, JSON-LD, and breadcrumbs are generated from the data.

## Star ratings in search
`REVIEW_SUMMARY` in `app/data/seo.ts` is `null` on purpose. Set it to the real numbers from your review app
(`{ ratingValue: "4.9", reviewCount: "37" }`) only if they match the reviews shown on the page. Google treats
mismatched ratings as spam.

## Crawl rules
- `/cart`, `/checkout` and `/app` (dashboard) are `noindex`.
- `robots.txt` allows search and AI crawlers; `llms.txt` summarizes the site for AI tools.

## Off-site (cannot be done from code)
Google Search Console + sitemap submission, Bing Webmaster Tools, Google Merchant Center, backlinks, real reviews.
