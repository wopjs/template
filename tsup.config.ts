import { defineConfig } from "tsup";
import mangleCache from "./mangle-cache.json";

export default defineConfig({
  entry: ["src/index.ts"],
  format: "esm",
  target: "esnext",
  clean: true,
  treeshake: true,
  dts: true,
  splitting: false,
  sourcemap: false,
  minify: false,
  esbuildOptions: options => {
    options.mangleProps = /[^_]_$/;
    options.mangleCache = mangleCache;
  },
});
