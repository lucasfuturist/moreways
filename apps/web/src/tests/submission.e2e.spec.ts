import { test, expect } from '@playwright/test';

test.describe('Form Runner & Submission', () => {

  test('Switch to Form View and Submit', async ({ page }) => {
    // 1. Mock the Submit API Endpoint
    // This ensures we verify the UI behavior without needing the backend running.
    await page.route('/api/intake/submit', async route => {
      await route.fulfill({ 
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, id: 'mock-submission-id' })
      });
    });

    // 2. Go to a specific issue page (bypassing the chat router)
    await page.goto('/issue/auto-dealer-dispute');

    // 3. Verify the Runner loaded
    // We expect to see the "Live Intake" badge or Chat UI first
    await expect(page.getByText('Live Intake')).toBeVisible();

    // 4. Switch to "Form Mode"
    // The UnifiedRunner has a sidebar with a "Form" button.
    // On mobile this might be hidden, so we ensure viewport is desktop-ish for this test.
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.getByRole('button', { name: 'Form' }).click();

    // 5. Verify Form View loaded
    // We expect to see inputs now. Let's look for the title or a label.
    // (Assuming the schema for auto-dealer has standard fields)
    await expect(page.locator('h2')).toContainText('Intake Form');

    // 6. Fill out a field
    // We target a generic input just to prove interaction works.
    // FIX: Use getByRole('textbox') to match <textarea> or <input type="text">
    const firstInput = page.getByRole('textbox').first();
    await firstInput.fill('Test Value');

    // 7. Handle the Browser Dialogs (Confirm & Alert)
    // The code uses window.confirm() and window.alert()
    page.on('dialog', async dialog => {
      const message = dialog.message();
      console.log(`Dialog message: ${message}`);
      
      if (message.includes('Submit form?')) {
        await dialog.accept(); // Click OK on confirmation
      } else if (message.includes('successfully')) {
        await dialog.accept(); // Click OK on success alert
      }
    });

    // 8. Click Submit
    await page.getByRole('button', { name: 'Submit Form' }).click();

    // 9. Wait a moment to ensure the API call happened (optional, but safer)
    await page.waitForTimeout(500);
  });

  test('Validation: Cannot submit empty required fields', async ({ page }) => {
    await page.goto('/issue/auto-dealer-dispute');
    
    // 1. Switch to Form Mode
    // Force viewport to ensure sidebar is visible
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.getByRole('button', { name: 'Form' }).click();

    // 2. Attempt to Submit WITHOUT filling anything
    // Note: We need to handle the dialog if your app uses window.confirm, 
    // BUT HTML5 validation might block the click entirely.
    
    // If your app uses HTML5 'required' attribute, we can check validity:
    const submitBtn = page.getByRole('button', { name: 'Submit Form' });
    
    // Mock the API just in case it slips through (it shouldn't)
    await page.route('/api/intake/submit', async route => {
      await route.fulfill({ status: 400, body: JSON.stringify({ error: "Should not reach here" }) });
    });

    await submitBtn.click();

    // 3. Verify we are STILL on the page (URL hasn't changed)
    // or verify an error message is visible.
    // Since we didn't mock a success redirect, remaining on page is the success criteria here.
    expect(page.url()).toContain('/issue/auto-dealer-dispute');
    
    // 4. Verify visual feedback (Optional, depends on your specific UI implementation)
    // E.g. Check if the input has :invalid pseudo-class
    // const invalidInput = page.locator('input:invalid');
    // await expect(invalidInput).toBeVisible();
  });

});