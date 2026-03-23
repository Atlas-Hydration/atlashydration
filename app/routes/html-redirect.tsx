import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";

/**
 * Catch-all route that handles:
 * 1. Old .html URLs → redirect to clean Remix routes
 * 2. Static tool pages (dev, app) → redirect to static HTML
 * 3. Everything else → 404
 */

const STATIC_PAGES: Record<string, string> = {
  "dev": "/atlashydration/dev/index.html",
  "dev/": "/atlashydration/dev/index.html",
  "app": "/atlashydration/app/index.html",
  "app/": "/atlashydration/app/index.html",
  "app/images": "/atlashydration/app/images.html",
  "app/packaging": "/atlashydration/app/packaging.html",
};

export default function HtmlRedirect() {
  const params = useParams();
  const navigate = useNavigate();
  const path = params["*"] || "";

  useEffect(() => {
    // Check if this is a static tool page
    if (STATIC_PAGES[path]) {
      window.location.href = STATIC_PAGES[path];
      return;
    }

    // Redirect old .html URLs to clean routes
    if (path.endsWith(".html")) {
      const clean = path.replace(/\.html$/, "").replace(/\/index$/, "").replace(/^index$/, "");
      navigate(`/${clean}`, { replace: true });
      return;
    }
  }, [path, navigate]);

  return (
    <main style={{ padding: "4rem 2rem", maxWidth: "800px", margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <h1>404</h1>
      <p>The requested page could not be found.</p>
      <a href="/atlashydration/" style={{ color: "#1d1d1f" }}>Go to homepage</a>
    </main>
  );
}
