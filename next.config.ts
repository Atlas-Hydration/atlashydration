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
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdks.shopifycdn.com https://cdn.shopify.com https://widgets.juniphq.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.juniphq.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://cdn.shopify.com https://images.unsplash.com https://*.shopifycdn.com https://*.juniphq.com https://*.gravatar.com https://customer-1sijhr9xl3yqixxu.cloudflarestream.com",
      "frame-src https://www.youtube.com https://customer-1sijhr9xl3yqixxu.cloudflarestream.com",
      "connect-src 'self' https://*.myshopify.com https://*.shopify.com https://*.juniphq.com",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  headers: async () => [
    { source: "/(.*)", headers: securityHeaders },
  ],
};

export default nextConfig;
