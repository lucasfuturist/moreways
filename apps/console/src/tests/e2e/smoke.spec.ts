import { test, expect } from '@playwright/test';

test.describe('ArgueOS Vertical Slice', () => {
  
  test('Lawyer can generate a form and see the preview', async ({ page }) => {
    await page.goto('/forms/new-from-prompt');

    // 2. Verify Chat Panel
    await expect(page.getByText('AI Architect')).toBeVisible();
    
    // 3. Type Prompt
    const promptInput = page.getByPlaceholder('Describe fields to add...');
    await promptInput.fill('Create a simple intake form');
    await promptInput.press('Enter');

    // 4. Debugging Trap
    const errorBubble = page.getByText(/error processing/i);
    if (await errorBubble.isVisible({ timeout: 5000 })) {
       throw new Error("🚨 BACKEND ERROR: The UI showed 'Error processing request'.");
    }

    // [FIX] Wait for the AI to finish "Thinking"
    // Instead of matching text (flaky), we wait for the loading animation to disappear.
    // This confirms the backend has returned a response.
    await expect(page.locator('.animate-bounce').first()).toBeHidden({ timeout: 30000 });

    // 5. Verify Canvas has Fields (The Real Success Check)
    // If the AI worked, there should be at least one text input on the right.
    const inputField = page.locator('input[type="text"]').first();
    await expect(inputField).toBeVisible();

    // 6. Visual Snapshot
    await expect(page).toHaveScreenshot('intake-generated-state.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02
    });
  });

  test('Inventory panel toggles correctly', async ({ page }) => {
    await page.goto('/forms/new-from-prompt');
    
    const inventoryPanel = page.locator('aside').filter({ hasText: 'Elements' });
    
    if (await inventoryPanel.isVisible()) {
        const closeButton = inventoryPanel.locator('button').first(); 
        await closeButton.click();
        await expect(inventoryPanel).not.toBeVisible();
    } 
    
    await page.getByRole('button', { name: 'Elements' }).click({ force: true });
    await expect(inventoryPanel).toBeVisible();
  });
});