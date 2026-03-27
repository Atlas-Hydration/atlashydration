import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("products/strawberry-lemonade", "routes/products/strawberry-lemonade.tsx"),
  route("products/grapefruit", "routes/products/grapefruit.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("shipping", "routes/shipping.tsx"),
] satisfies RouteConfig;
