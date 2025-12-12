// File: vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.{test,spec}.ts'],
    // Exclude Playwright tests to prevent "test.describe" errors
    exclude: ['tests/e2e/**/*', 'node_modules/**/*'],
    testTimeout: 10000
  },
});