import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Compliance', () => {

  test('Marketing Home Page', async ({ page }) => {
    await page.goto('/');
    
    // Analyze the page
    const results = await new AxeBuilder({ page }).analyze();
    
    // Fail if any violations are found
    expect(results.violations).toEqual([]);
  });

  test('Intake Start Page', async ({ page }) => {
    await page.goto('/start');
    
    const results = await new AxeBuilder({ page })
      // Optional: Exclude third-party widgets if you had them
      .analyze();
      
    expect(results.violations).toEqual([]);
  });

  test('Login Page', async ({ page }) => {
    await page.goto('/login');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

});