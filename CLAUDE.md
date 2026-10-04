# Atlas Hydration

Premium zero-sugar electrolyte drink mix brand website. Next.js app with Shopify Buy SDK integration for e-commerce checkout.

## Deployment

- **Hosting:** Vercel (primary) + GitHub Pages fallback
- **Workflow:** `.github/workflows/deploy.yml` (GitHub Pages)
- **Triggers:** Pushes to `main` and `claude/**` branches, plus manual `workflow_dispatch`
- **Build:** `next build` with static export (`output: "export"`)
- **Output:** `out/`

## Project Structure

```
├── app/
│   ├── layout.tsx           # Root layout (fonts, CartProvider, Header, Footer)
│   ├── page.tsx             # Home page (all 15 sections + Popup)
│   ├── globals.css          # All site styles (~8,200 lines)
│   ├── components/
│   │   ├── Header.tsx       # Sticky nav, announcement bar, mobile menu
│   │   ├── Footer.tsx       # Footer with links, social, payment icons
│   │   ├── CartDrawer.tsx   # Slide-out cart drawer
│   │   ├── Popup.tsx        # Email signup modal (10% off)
│   │   └── home/            # 15 home page section components
│   ├── context/
│   │   └── CartContext.tsx   # Cart state + Shopify Buy SDK integration
│   ├── data/
│   │   └── products.ts      # Product catalog (types + data)
│   ├── products/
│   │   ├── strawberry-lemonade/page.tsx
│   │   └── grapefruit/page.tsx
│   ├── privacy/page.tsx
│   └── shipping/page.tsx
├── public/                  # Static assets (images, logos, favicon, manifest)
├── next.config.ts           # Next.js config (static export, unoptimized images)
├── package.json
└── tsconfig.json
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home — hero, vitamin strip, featured product, science, compare, reviews, why atlas, benefits, daily electrolytes, blog, founder, FAQ, CTA, sticky buy bar |
| `/products/strawberry-lemonade` | Strawberry Lemonade product detail page |
| `/products/strawberry-lemonade/2-pack` | Landing URL for ads/email: same page with Strawberry Lemonade, 2 pouches, one-time preselected (adds nothing to the cart; keeps `utm_*`/`fbclid`; canonical is the main product page) |
| `/products/grapefruit` | Grapefruit product detail page |
| `/privacy` | Privacy policy |
| `/shipping` | Shipping & returns policy |

## Architecture

- **Framework:** Next.js 16 with App Router, TypeScript
- **Build:** Turbopack (dev), static export for production
- **E-commerce:** Shopify Storefront API via Buy SDK (CDN loaded at runtime)
- **Fonts:** Google Fonts (Inter + Playfair Display)
- **Styling:** Single CSS file with CSS custom properties, BEM naming
- **Cart:** Shopify Buy SDK with localStorage fallback
- **State:** React Context API (CartContext)

## Pricing

All pricing rules, the active-offer table, and the checkout QA matrix live in `docs/PRICING.md`.
Shopify checkout is the source of truth; code mirrors it from `app/data/pricing.ts`.
All add-to-cart buttons share one selection (`app/context/PurchaseSelectionContext.tsx`, `app/data/purchase.ts`); see "Every buy button shares one selection" in that doc. Tracking facts and the Meta verification checklist live in `docs/MEASUREMENT.md` (do not add a second Pixel/CAPI pipeline).

## Shopify Integration

- **Shop domain:** `7fa7b7-42.myshopify.com`
- **Storefront token:** Configured in `app/context/CartContext.tsx`
- **Products:** Strawberry Lemonade (variant `42739482067018`), Grapefruit (variant `41850457817162`)

## Claude Code Branch Constraints

Claude Code can only push to its own session branch (`claude/xxx-sessionId`) and will get a 403 on other branches. This is by design, not a bug. The deploy workflow is configured to trigger on `claude/**` branches so any Claude Code session can push and auto-deploy.
