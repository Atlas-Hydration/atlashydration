# Atlas Hydration

Premium zero-sugar electrolyte drink mix brand website. Static HTML/CSS/JS site with Shopify Buy SDK integration for e-commerce checkout.

## Live Site

**URL:** https://rwb8771.github.io/atlashydration/

## Deployment

- **Hosting:** GitHub Pages via GitHub Actions
- **Workflow:** `.github/workflows/deploy.yml`
- **Triggers:** Pushes to `main` and `claude/**` branches, plus manual `workflow_dispatch`
- **Build:** No build step — the entire repo root is uploaded as a static artifact
- **Deploy action:** `actions/deploy-pages@v4`

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Landing page — hero, products, science, mission, testimonials |
| `products/strawberry-lemonade.html` | Strawberry Lemonade product detail page |
| `products/lemon-lime.html` | Lemon Lime product detail page |
| `css/styles.css` | All site styles (light theme, responsive) |
| `js/shopify.js` | Shopify Buy SDK integration — cart, checkout, product variants |
| `js/main.js` | UI interactions — mobile menu, scroll animations, counters |
| `manifest.json` | PWA manifest |
| `sitemap.xml` | SEO sitemap |
| `robots.txt` | Search engine crawl rules |
| `.github/workflows/deploy.yml` | GitHub Pages deployment workflow |

## Navigation / Page Structure

- **Landing page** (`/`) — Announcement bar, hero with split layout, vitamin strip, product grid, science section, how-it-works, mission, testimonials, CTA, footer
- **Product pages** (`/products/*.html`) — Individual product detail pages with supplement facts, add-to-cart
- **Cart** — Slide-out drawer cart (built in `js/shopify.js`), works with or without Shopify SDK

## Architecture

- **Framework:** None — vanilla HTML, CSS, JavaScript
- **Build tools:** None — no bundler, preprocessor, or package manager
- **E-commerce:** Shopify Storefront API via Buy SDK (CDN loaded)
- **Fonts:** Google Fonts (Inter + Playfair Display)
- **Styling:** Single CSS file with CSS custom properties, BEM naming
- **Cart:** Shopify Buy SDK with localStorage fallback for offline/SDK-unavailable scenarios

## Shopify Integration

- **Shop domain:** `7fa7b7-42.myshopify.com`
- **Storefront token:** Configured in `js/shopify.js`
- **Products:** Strawberry Lemonade (variant `7693950255178`), Lemon Lime (variant `7862662103114`)

## Claude Code Branch Constraints

Claude Code can only push to its own session branch (`claude/xxx-sessionId`) and will get a 403 on other branches. This is by design, not a bug. The deploy workflow is configured to trigger on `claude/**` branches so any Claude Code session can push and auto-deploy.
