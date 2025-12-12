import { test, expect } from '@playwright/test';

test.describe('Portal Data Access', () => {

  // Helper to get past login quickly
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Client' }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('Dashboard loads list of claims', async ({ page }) => {
    // 1. Check for the main welcome heading
    await expect(page.getByText('Welcome, Dev')).toBeVisible();

    // 2. Verify specific mock claims are visible (from portal.repo.ts)
    // We look for the "Vehicle Accident" card
    const accidentCard = page.locator('a').filter({ hasText: 'Vehicle Accident' });
    await expect(accidentCard).toBeVisible();
    
    // 3. Verify status badges are rendering
    // Look for "Under Review" text which corresponds to the status config
    await expect(page.getByText('Under Review').first()).toBeVisible();
  });

  test('View Claim Details (Drill-down)', async ({ page }) => {
    // 1. Click the "Vehicle Accident" claim
    await page.getByText('Vehicle Accident').click();

    // 2. Verify URL change
    await expect(page).toHaveURL(/\/dashboard\/claim\/mock-claim-01/);

    // 3. Verify Detail Page Header
    await expect(page.locator('h1')).toContainText('Vehicle Accident');
    
    // 4. Verify Sensitive Data is rendered (from the formData JSON)
    // We check for "State Farm" which is in the mock data
    await expect(page.getByText('State Farm')).toBeVisible();
    await expect(page.getByText('Whiplash and neck pain')).toBeVisible();
  });

  test('Navigate back to Dashboard', async ({ page }) => {
    // 1. Go deep into a claim
    await page.goto('/dashboard/claim/mock-claim-01');

    // 2. Click "Back to Cases"
    await page.getByText('Back to Cases').click();

    // 3. Verify we are back home
    await expect(page).toHaveURL(/\/dashboard$/); // Ends with dashboard
  });

});