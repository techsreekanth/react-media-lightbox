import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "react-media-lightbox/styles.css",
        replacement: path.resolve(root, "../src/styles.css"),
      },
      {
        find: "react-media-lightbox-pro/styles.css",
        replacement: path.resolve(root, "../pro/src/styles.css"),
      },
      {
        find: "react-media-lightbox-pro",
        replacement: path.resolve(root, "../pro/src/index.ts"),
      },
      {
        find: "react-media-lightbox",
        replacement: path.resolve(root, "../src/index.ts"),
      },
    ],
  },
});
