import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      include: ["src/**"],
      reporter: ["html", "text", "json-summary"],
    },
    execArgv: ["--expose-gc"],
  },
});
