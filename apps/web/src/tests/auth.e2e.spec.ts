import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  
  test('Client Login (Happy Path)', async ({ page }) => {
    await page.goto('/login');
    
    // Simulate Client Login via Dev Button
    await page.getByRole('button', { name: 'Client' }).click();

    // Verify Dashboard Access
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('Welcome, Dev')).toBeVisible();
    
    // [FIX] Target ONLY the visible button (Desktop)
    // The Navbar has duplicate menus (mobile/desktop). We must click the visible one.
    const userMenuTrigger = page.locator('button:visible').filter({ hasText: 'DC' });

    await expect(userMenuTrigger).toBeVisible({ timeout: 10000 });
    await userMenuTrigger.click();

    // Verify Menu Open
    await expect(page.getByText('Sign Out')).toBeVisible();
    await expect(page.getByText(/Dev Client/)).toBeVisible();
  });

  test('Lawyer Redirect (Cross-App Navigation)', async ({ page }) => {
    await page.goto('/login');

    const navigationPromise = page.waitForURL('**/crm', { timeout: 10000 });

    await page.getByRole('button', { name: 'Lawyer' }).click();

    try {
      await navigationPromise;
    } catch (e) {
      expect(page.url()).toContain(':3001/crm');
    }
  });

  test('Security: Unauthenticated Access Blocked', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
  
  test('Security: Invalid Login Feedback', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'bad@actor.com');
    await page.fill('input[name="password"]', 'wrongpass');
    
    // Scope to the form to avoid clicking the Navbar "Sign In" button
    await page.locator('form').getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText(/Invalid credentials/i)).toBeVisible();
  });
});