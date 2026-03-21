import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "/atlashydration/",
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "app"),
    },
  },
  plugins: [
    remix({
      ssr: false,
      basename: "/atlashydration/",
    }),
  ],
});
