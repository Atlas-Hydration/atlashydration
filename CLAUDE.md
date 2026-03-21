# Atlas Hydration

Premium zero-sugar electrolyte drink mix brand website. Remix (React) SPA with Shopify Buy SDK integration for e-commerce checkout.

## Live Site

**URL:** https://rwb8771.github.io/atlashydration/

## Deployment

- **Hosting:** GitHub Pages via GitHub Actions
- **Workflow:** `.github/workflows/deploy.yml`
- **Triggers:** Pushes to `main` and `claude/**` branches, plus manual `workflow_dispatch`
- **Build:** `npm run build` (Remix + Vite), outputs to `build/client/`
- **Deploy action:** `actions/deploy-pages@v4`

## Architecture

- **Framework:** Remix v2 with Vite (SPA mode, `ssr: false`)
- **Build tools:** Vite bundler, TypeScript
- **Routing:** Remix file-based routing (`app/routes/`)
- **E-commerce:** Shopify Storefront API via Buy SDK (CDN loaded)
- **Fonts:** Google Fonts (Inter + Playfair Display)
- **Styling:** Single CSS file with CSS custom properties, BEM naming (imported in root.tsx)
- **Cart:** Shopify Buy SDK with localStorage fallback for offline/SDK-unavailable scenarios
- **Base path:** `/atlashydration/` (configured in vite.config.ts for GitHub Pages)

## Key Files

| File | Purpose |
|------|---------|
| `app/root.tsx` | Root layout — html shell, CSS/font imports, meta tags |
| `app/routes/_index.tsx` | Landing page route |
| `app/routes/products.strawberry-lemonade.tsx` | Strawberry Lemonade product page route |
| `app/routes/products.grapefruit.tsx` | Grapefruit product page route |
| `app/content/*.html` | Raw HTML body content (imported via `?raw`) |
| `app/lib/effects.ts` | Dynamic script loader for client-side JS |
| `app/lib/shopify.ts` | Shopify Buy SDK integration (TypeScript module) |
| `app/styles/styles.css` | All site styles (imported by Remix) |
| `js/shopify.js` | Original Shopify integration (loaded dynamically) |
| `js/main.js` | Original UI interactions (loaded dynamically) |
| `css/styles.css` | Original CSS (kept for static pages) |
| `public/` | Static assets (logo, favicon, manifest, robots, sitemap) |
| `vite.config.ts` | Vite + Remix configuration |
| `package.json` | Dependencies and build scripts |

## Navigation / Page Structure

- **Landing page** (`/`) — Announcement bar, hero with video, vitamin strip, featured product, science section, comparison table, reviews, blog, founder, FAQ, CTA, footer
- **Product pages** (`/products/*`) — Product gallery, details, supplement facts, purchase options, reviews, FAQ
- **Blog** (`/blog/*`) — Static HTML pages (not yet converted to Remix routes)
- **Cart** — Slide-out drawer cart (built in `js/shopify.js`), works with or without Shopify SDK

## Development

```bash
npm install        # Install dependencies
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build
```

## Shopify Integration

- **Shop domain:** `7fa7b7-42.myshopify.com`
- **Storefront token:** Configured in `js/shopify.js` and `app/lib/shopify.ts`
- **Products:** Strawberry Lemonade (variant `42739482067018`), Grapefruit (variant `41850457817162`)

## Migration Notes

The site was migrated from static HTML/CSS/JS to Remix SPA mode. Key approach:
- HTML body content is stored in `app/content/*.html` and imported as raw strings
- Original `js/main.js` and `js/shopify.js` are loaded dynamically after React renders
- CSS is imported through Remix's links system for proper cache busting
- Static pages (blog, shipping, privacy) are copied to build output as-is
- `404.html` is a copy of `index.html` for SPA client-side routing on GitHub Pages

## Claude Code Branch Constraints

Claude Code can only push to its own session branch (`claude/xxx-sessionId`) and will get a 403 on other branches. This is by design, not a bug. The deploy workflow is configured to trigger on `claude/**` branches so any Claude Code session can push and auto-deploy.
