import { test, expect } from '@playwright/test';

test.describe('Legal Guardrails & Compliance', () => {
  
  // [REMOVED] Jurisdiction test

  test('PII Warning appears for sensitive fields', async ({ page }) => {
    await page.goto('/forms/new-from-prompt');

    // 1. Ensure Sidebar is Closed
    const inventoryPanel = page.locator('aside').filter({ hasText: 'Elements' });
    if (await inventoryPanel.isVisible()) {
       await page.getByRole('button', { name: 'Elements' }).click();
    }

    // 2. Ask AI
    const promptInput = page.getByPlaceholder('Describe fields to add...');
    await promptInput.fill('Add a field for Social Security Number');
    await promptInput.press('Enter');

    // 3. Wait for AI
    await expect(page.locator('.animate-bounce').first()).toBeHidden({ timeout: 30000 });

    // 4. Hover the Text Target
    const labelText = page.getByText(/Social Security Number/i).last();
    await labelText.hover({ force: true });

    // 5. Verify Badge
    await expect(page.getByText('SENSITIVE DATA')).toBeVisible();

    // 6. Visual Snapshot
    await expect(page).toHaveScreenshot('guardrails-pii-warning.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02
    });
  });

});