import { useEffect } from "react";
import type { MetaFunction } from "@remix-run/react";
import { initEffects } from "~/lib/effects";
import bodyContent from "~/content/index-body.html?raw";

export const meta: MetaFunction = () => [
  { title: "Atlas Hydration | Zero-Sugar Electrolyte Mixes" },
  {
    name: "description",
    content:
      "Shop premium zero-sugar electrolyte drink mixes with 1,300mg electrolytes, B vitamins, and amino acids. Subscribe and save 20%. Free shipping over $50.",
  },
  {
    name: "keywords",
    content:
      "electrolyte drink mix, zero sugar electrolytes, sports hydration, Atlas Hydration, electrolyte powder, sugar free hydration, recovery drink",
  },
  { name: "author", content: "Atlas Hydration" },
  { name: "robots", content: "index, follow" },
  {
    property: "og:type",
    content: "website",
  },
  {
    property: "og:title",
    content: "Atlas Hydration | Zero-Sugar Electrolyte Mixes",
  },
  {
    property: "og:description",
    content:
      "Premium zero-sugar electrolyte drink mixes with 1,300mg electrolytes, B vitamins, and amino acids. Subscribe and save 20%.",
  },
  { property: "og:url", content: "https://rwb8771.github.io/atlashydration/" },
  {
    property: "og:image",
    content: "https://rwb8771.github.io/atlashydration/logo.svg",
  },
  { property: "og:site_name", content: "Atlas Hydration" },
  { property: "og:locale", content: "en_US" },
  { name: "twitter:card", content: "summary_large_image" },
  {
    name: "twitter:title",
    content: "Atlas Hydration | Zero-Sugar Electrolyte Mixes",
  },
  {
    name: "twitter:description",
    content:
      "Premium zero-sugar electrolyte drink mixes with 1,300mg electrolytes, B vitamins, and amino acids. Subscribe and save 20%.",
  },
  {
    name: "twitter:image",
    content: "https://rwb8771.github.io/atlashydration/logo.svg",
  },
];

export default function Index() {
  useEffect(() => {
    const cleanup = initEffects();
    return cleanup;
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: bodyContent }} />;
}
