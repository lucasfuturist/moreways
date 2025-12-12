import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // 1. Look for tests in the src/tests/e2e folder
  testDir: './src/tests/e2e',
  
  // 2. Run tests in files in parallel
  fullyParallel: true,
  
  // 3. Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // 4. Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // 5. Opt out of parallel tests on CI (safer for DB tests)
  workers: process.env.CI ? 1 : undefined,
  
  // 6. Reporter to use
  reporter: 'html',
  
  /* Shared settings for all the projects below */
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  /* Visual Regression settings for "Midnight Glass" UI */
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02, // Allow 2% pixel difference for anti-aliasing
      threshold: 0.2, 
    },
  },

  /* Configure projects for major browsers */
  projects: [
    // Desktop
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    // Mobile (Pixel 5) - Catches layout breaks on small screens
/*     {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    }, */
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
    timeout: 120 * 1000, // Allow 2 mins for Next.js to boot if cold
    // NOTE: 'env' block removed so it loads your real .env file (Real OpenAI Mode)
  },
});