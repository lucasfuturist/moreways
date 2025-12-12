// vitest.config.ts

// CommonJS-style config so it plays nicely with TypeScript when this file
// is treated as a CJS module. We also wire up the `@` alias → `src`.

const { defineConfig } = require("vitest/config");
const path = require("path");

module.exports = defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["src/tests/**/*.test.ts"],
    setupFiles: ["src/tests/setup/env.setup.ts"],
    coverage: {
      reporter: ["text", "lcov"],
    },
  },
});
