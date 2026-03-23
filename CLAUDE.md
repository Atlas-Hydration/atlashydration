# Atlas Hydration

Premium zero-sugar electrolyte drink mix brand website. Built with Remix (React Router v7) with Shopify Buy SDK integration for e-commerce checkout.

## Live Site

**URL:** https://rwb8771.github.io/atlashydration/

## Tech Stack

- **Framework:** Remix / React Router v7 (SPA mode)
- **Language:** TypeScript + React 19
- **Build:** Vite
- **E-commerce:** Shopify Storefront API via Buy SDK (CDN loaded)
- **Fonts:** Google Fonts (Inter + Playfair Display)
- **Styling:** Single CSS file with CSS custom properties, BEM naming
- **Cart:** Shopify Buy SDK with localStorage fallback

## Development

```bash
npm install
npm run dev      # Start dev server
npm run build    # Production build to build/client/
npm run start    # Serve production build
```

## Deployment

- **Hosting:** GitHub Pages via GitHub Actions
- **Workflow:** `.github/workflows/deploy.yml`
- **Triggers:** Pushes to `main`, `master`, and `claude/**` branches, plus manual `workflow_dispatch`
- **Build:** `npm ci && npm run build` → deploys `build/client/`
- **SPA Routing:** `404.html` copied from `index.html` post-build for client-side routing fallback

## Key Files

| File | Purpose |
|------|---------|
| `app/root.tsx` | Root layout — HTML shell, global CSS, fonts, meta |
| `app/routes.ts` | Route definitions |
| `app/routes/home.tsx` | Landing page route |
| `app/routes/products.strawberry-lemonade.tsx` | Strawberry Lemonade product page |
| `app/routes/products.grapefruit.tsx` | Grapefruit product page |
| `app/routes/blog.*.tsx` | Blog article routes |
| `app/routes/privacy.tsx` | Privacy policy page |
| `app/routes/shipping.tsx` | Shipping & returns page |
| `app/hooks/useClientScripts.ts` | Hook for loading Shopify SDK + client JS |
| `public/css/styles.css` | All site styles |
| `public/js/shopify.js` | Shopify Buy SDK integration — cart, checkout |
| `public/js/main.js` | UI interactions — mobile menu, scroll animations |
| `public/js/svg-animations.js` | SVG animation effects |
| `public/images/` | Static images |
| `public/manifest.json` | PWA manifest |
| `public/sitemap.xml` | SEO sitemap |
| `public/robots.txt` | Search engine crawl rules |

## Architecture

- **SPA Mode:** `ssr: false` — no server required, outputs static files
- **Base Path:** `/atlashydration/` (configured in both `react-router.config.ts` and `vite.config.ts`)
- **Client Scripts:** Loaded via `useClientScripts()` hook in each route — handles Shopify SDK + legacy JS initialization
- **CSS:** Global stylesheet loaded via `root.tsx` links function
- **Structured Data:** JSON-LD scripts rendered inline via `dangerouslySetInnerHTML`

## Shopify Integration

- **Shop domain:** `7fa7b7-42.myshopify.com`
- **Storefront token:** Configured in `public/js/shopify.js`
- **Products:** Strawberry Lemonade (variant `42739482067018`), Grapefruit (variant `41850457817162`)

## Claude Code Branch Constraints

Claude Code can only push to its own session branch (`claude/xxx-sessionId`) and will get a 403 on other branches. This is by design, not a bug. The deploy workflow is configured to trigger on `claude/**` branches so any Claude Code session can push and auto-deploy.
