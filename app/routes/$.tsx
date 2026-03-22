import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";

/**
 * Catch-all route: redirects any unmatched URL back to the homepage.
 * Prevents blank pages when users visit non-existent paths.
 */
export default function CatchAll() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  return null;
}
