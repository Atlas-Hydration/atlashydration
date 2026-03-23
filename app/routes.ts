import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  // Product pages
  route("products/strawberry-lemonade", "routes/products.strawberry-lemonade.tsx"),
  route("products/grapefruit", "routes/products.grapefruit.tsx"),

  // Blog
  route("blog", "routes/blog.index.tsx"),
  route("blog/allulose-performance", "routes/blog.allulose-performance.tsx"),
  route("blog/b-vitamins-energy", "routes/blog.b-vitamins-energy.tsx"),
  route("blog/complete-formula", "routes/blog.complete-formula.tsx"),
  route("blog/dehydration-basics", "routes/blog.dehydration-basics.tsx"),
  route("blog/glutamine-recovery", "routes/blog.glutamine-recovery.tsx"),
  route("blog/hydration-timing", "routes/blog.hydration-timing.tsx"),
  route("blog/hydration-travel", "routes/blog.hydration-travel.tsx"),
  route("blog/magnesium-deficiency", "routes/blog.magnesium-deficiency.tsx"),
  route("blog/potassium-heart", "routes/blog.potassium-heart.tsx"),
  route("blog/sodium-science", "routes/blog.sodium-science.tsx"),
  route("blog/taurine-endurance", "routes/blog.taurine-endurance.tsx"),
  route("blog/vitamin-c-immunity", "routes/blog.vitamin-c-immunity.tsx"),

  // Utility pages
  route("privacy", "routes/privacy.tsx"),
  route("shipping", "routes/shipping.tsx"),
] satisfies RouteConfig;
