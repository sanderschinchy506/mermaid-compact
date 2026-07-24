import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // mermaid needs a DOM to render into.
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    // `src` is a thin re-export; there's no point instrumenting the 3MB
    // vendored bundle in `dist`.
    coverage: {
      include: ["src/**"],
    },
  },
});
