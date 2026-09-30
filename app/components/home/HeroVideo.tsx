"use client";

import { useEffect, useState } from "react";

/**
 * The hero background video. Only the player that matches the screen is
 * loaded, and only after the page has finished loading, so the poster image
 * paints first and the video never competes with it for bandwidth.
 */
export default function HeroVideo({ desktopSrc, mobileSrc }: { desktopSrc: string; mobileSrc: string }) {
  const [mode, setMode] = useState<"desktop" | "mobile" | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const start = () => setMode(mq.matches ? "mobile" : "desktop");
    if (document.readyState === "complete") {
      start();
      return;
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  if (mode === "mobile") {
    return (
      <iframe
        className="hero__video-cf hero__video-cf--mobile"
        src={mobileSrc}
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="Atlas Hydration hero video background mobile"
      />
    );
  }
  if (mode === "desktop") {
    return (
      <iframe
        className="hero__video-cf hero__video-cf--desktop"
        src={desktopSrc}
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="Atlas Hydration hero video background"
      />
    );
  }
  return null;
}
