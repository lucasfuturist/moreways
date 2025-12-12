import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }, // Critical for ITP testing
  ],
  webServer: {
    command: 'npm run start:api',
    url: 'http://localhost:3000/health',
    reuseExistingServer: !process.env.CI,
  },
});