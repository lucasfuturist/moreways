import { test, expect } from '@playwright/test';

test.describe('AI Intake Flow', () => {

  test('Happy Path: Chat -> Router -> Form Redirect', async ({ page }) => {
    // 1. Mock the AI Endpoint
    // We intercept the POST request to /api/chat so we don't hit OpenAI
    await page.route('/api/chat', async route => {
      const json = {
        message: "I understand. This looks like a Auto – Dealership issue.",
        router_data: {
          form_type: "Auto – Dealership or Repair",
          needs_clarification: "no",
          reason: "Test match"
        }
      };
      await route.fulfill({ json });
    });

    // 2. Go to the Start Page
    await page.goto('/start');
    
    // 3. User types a complaint
    const input = page.locator('textarea');
    await input.fill('My new car broke down immediately.');
    
    // 4. Click Send (using the icon button)
    await page.locator('button:has(svg.lucide-send)').click();

    // 5. Verify the AI bubble appears (from our mock)
    await expect(page.getByText('This looks like a Auto – Dealership')).toBeVisible();

    // 6. Verify Redirect
    // The ChatInterface has a 1.5s delay before redirecting.
    // We expect to land on the specific issue form.
    await expect(page).toHaveURL(/\/issue\/auto-dealer-dispute/, { timeout: 10000 });
  });

  test('Clarification Path: AI asks a question', async ({ page }) => {
    // 1. Mock AI asking for clarification
    await page.route('/api/chat', async route => {
      const json = {
        message: "Did you sign a written contract?",
        router_data: {
          needs_clarification: "yes",
          clarification_question: "Did you sign a written contract?"
        }
      };
      await route.fulfill({ json });
    });

    await page.goto('/start');
    await page.locator('textarea').fill('I have a problem.');
    await page.locator('button:has(svg.lucide-send)').click();

    // 2. Verify AI asks the question NOT redirects
    await expect(page.getByText('Did you sign a written contract?')).toBeVisible();
    expect(page.url()).toContain('/start'); // Should stay on page
  });

  test('Mobile Responsive Check', async ({ page }) => {
    // 1. Set viewport to iPhone size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/start');

    // 2. Verify chat input is visible and reachable
    const input = page.locator('textarea');
    await expect(input).toBeVisible();
    
    // 3. Verify standard complaints FAB (floating button) is clickable
    await page.locator('button:has(span.sr-only:has-text("Standard Complaints"))').click();
    await expect(page.getByText('Select an Issue')).toBeVisible();
  });

});