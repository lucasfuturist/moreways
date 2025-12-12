import { test, expect } from '@playwright/test';

test.describe('Claim Validation Flow (AI Judge)', () => {

  test('should display a Strong Case verdict for valid inputs', async ({ page }) => {
    
    // 1. MOCK THE JUDGE (The API Proxy)
    // We intercept the call to /api/intake/validate so we control the verdict.
    await page.route('/api/intake/validate', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            status: "LIKELY_VIOLATION",
            confidence_score: 0.95,
            analysis: {
              summary: "The dealer failed to repair safety defects within 3 attempts.",
              missing_elements: [],
              strength_factors: ["3 repair attempts", "Safety defect"],
              weakness_factors: []
            },
            relevant_citations: ["urn:lex:ma:lemon_law"]
          }
        })
      });
    });

    // 2. Go to the Auto Issue page
    await page.goto('/issue/auto-dealer-dispute');

    // 3. Fill out the form (Fast Forward)
    // We just need to trigger the "Next Field" logic until we hit the end.
    // Assuming the first field is active.
    const input = page.locator('input').first();
    const submitBtn = page.locator('button:has(svg.lucide-send)');

    // Field 1
    await input.fill('2023 Honda Civic');
    await submitBtn.click();
    await page.waitForTimeout(500); // Wait for transition

    // Field 2 (Mocking a few interactions to simulate progress)
    // In a real test, we might iterate through all fields, but for this 
    // specific test, we assume the Runner's "Next" logic works and we just
    // want to test the END of the flow.
    
    // TRICK: We can inject state directly into LocalStorage to skip to the end?
    // Better: Just answer quickly.
    
    // If the form has many fields, this might be tedious. 
    // Let's rely on the "Auto-Save" logic or just answer a few.
    // For this specific test, let's assume we fill 2 fields and the logic triggers validation 
    // (requires modifying the schema to be short or just keep answering).
    
    // Actually, let's just keep answering "Test" until we see "Evaluating..."
    // This makes the test resilient to Schema changes.
    
    let attempts = 0;
    while (attempts < 10) {
        // Check if Validation started
        if (await page.getByText('Evaluating...').isVisible()) break;
        
        // Check if Verdict is already there
        if (await page.getByText('Strong Claim Detected').isVisible()) break;

        // Otherwise, answer the current field
        if (await input.isVisible()) {
            await input.fill('Test Answer');
            await submitBtn.click();
            await page.waitForTimeout(600); // UI transition
        } else {
            // Maybe it's a select/radio? Try clicking the first option if visible
            // Simplified: Just wait.
            await page.waitForTimeout(500);
        }
        attempts++;
    }

    // 4. Verify "Evaluating" State
    // (It might flash too fast, so we might miss it, but checking Verdict is key)

    // 5. Verify VERDICT CARD appears
    await expect(page.getByText('Strong Claim Detected')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('95% Confidence')).toBeVisible();
    await expect(page.getByText('dealer failed to repair')).toBeVisible();

    // 6. Verify "Continue" Flow
    // Click "Continue to Submission"
    await page.getByRole('button', { name: 'Continue to Submission' }).click();

    // 7. Verify Completion Options appear (Finish & Register)
    await expect(page.getByRole('button', { name: 'Finish & Register' })).toBeVisible();
  });

  test('should fail open (allow submission) if validation errors', async ({ page }) => {
    // 1. MOCK ERROR (500)
    await page.route('/api/intake/validate', async route => {
      await route.fulfill({ status: 500 });
    });

    await page.goto('/issue/auto-dealer-dispute');
    
    // 2. Fill inputs until done...
    const input = page.locator('input').first();
    const submitBtn = page.locator('button:has(svg.lucide-send)');
    
    let attempts = 0;
    while (attempts < 10) {
        if (await page.getByRole('button', { name: 'Finish & Register' }).isVisible()) break;
        if (await input.isVisible()) {
            await input.fill('Test');
            await submitBtn.click();
            await page.waitForTimeout(600);
        }
        attempts++;
    }

    // 3. Verify we skipped to Completion Options WITHOUT a Verdict Card
    await expect(page.getByRole('button', { name: 'Finish & Register' })).toBeVisible();
    await expect(page.getByText('Strong Claim Detected')).not.toBeVisible();
  });

});