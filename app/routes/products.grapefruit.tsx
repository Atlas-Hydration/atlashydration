import { useEffect } from "react";
import type { MetaFunction } from "@remix-run/react";
import { initEffects } from "~/lib/effects";
import bodyContent from "~/content/grapefruit-body.html?raw";

export const meta: MetaFunction = () => [
  {
    title: "Grapefruit Electrolyte Drink Mix | Atlas Hydration",
  },
  {
    name: "description",
    content:
      "Atlas Hydration Grapefruit — premium zero-sugar electrolyte drink mix with 1,300mg electrolytes, B vitamins, Vitamin C, and recovery amino acids. 16 stick packs, only 5 calories.",
  },
];

export default function Grapefruit() {
  useEffect(() => {
    const cleanup = initEffects();
    return cleanup;
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: bodyContent }} />;
}
