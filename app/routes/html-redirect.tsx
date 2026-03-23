import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";

/**
 * Catch-all route that redirects old .html URLs to clean Remix equivalents.
 * Works client-side in SPA mode.
 */
export default function HtmlRedirect() {
  const params = useParams();
  const navigate = useNavigate();
  const path = params["*"] || "";

  useEffect(() => {
    if (path.endsWith(".html")) {
      const clean = path.replace(/\.html$/, "").replace(/\/index$/, "").replace(/^index$/, "");
      navigate(`/${clean}`, { replace: true });
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
