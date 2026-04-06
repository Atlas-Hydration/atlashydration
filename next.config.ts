import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.shopify.com https://widgets.juniphq.com https://www.googletagmanager.com https://www.google-analytics.com blob:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.juniphq.com https://api.mapbox.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://cdn.shopify.com https://images.unsplash.com https://*.shopifycdn.com https://*.juniphq.com https://*.gravatar.com https://customer-1sijhr9xl3yqixxu.cloudflarestream.com",
      "frame-src https://www.youtube.com https://customer-1sijhr9xl3yqixxu.cloudflarestream.com",
      "connect-src 'self' https://*.myshopify.com https://*.shopify.com https://*.juniphq.com https://www.google-analytics.com https://analytics.google.com https://*.google-analytics.com https://api.mapbox.com https://*.tiles.mapbox.com https://events.mapbox.com",
      "worker-src blob:",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  ...(process.env.STATIC_EXPORT === "true" ? { output: "export" as const } : {}),
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  headers: async () => [
    { source: "/(.*)", headers: securityHeaders },
  ],
};

export default nextConfig;
