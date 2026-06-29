import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ["react", "react-dom"],
  // Ship the stylesheet as a standalone, importable asset:
  //   import "react-media-lightbox/styles.css"
  onSuccess: "cp src/styles.css dist/styles.css",
});
