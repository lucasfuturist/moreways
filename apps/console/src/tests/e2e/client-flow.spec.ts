import { test, expect } from '@playwright/test';

test.describe('Client Submission Flow', () => {
  let formId: string;

  // Setup: Create a form via API so we have something to test
  test.beforeAll(async ({ request }) => {
    const res = await request.post('/api/forms', {
      data: {
        name: 'E2E Test Form',
        organizationId: 'org_default_local',
        schema: {
          type: 'object',
          properties: {
            fullName: { kind: 'text', title: 'Full Name', isRequired: true },
            email: { kind: 'email', title: 'Email Address', isRequired: true },
            description: { kind: 'textarea', title: 'What happened?' }
          },
          order: ['fullName', 'email', 'description'],
          required: ['fullName', 'email']
        }
      }
    });
    const data = await res.json();
    formId = data.id;
  });

  test('Client can submit a form and Lawyer sees it in CRM', async ({ page }) => {
    // --- STEP 1: CLIENT SUBMISSION ---
    // Go to the public link
    await page.goto(`/s/${formId}`);

    // Verify Branding
    await expect(page.getByRole('heading', { name: 'E2E Test Form' })).toBeVisible();

    // Click "Start Intake" to reveal the actual form inputs
    await page.getByRole('button', { name: 'Start Intake' }).click();
    
    // Wait for form container to be visible
    await expect(page.locator('form')).toBeVisible();

    // Fill Form
    // We use specific targeting or fallbacks since labels might have asterisks
    await page.locator('input').first().fill('John Doe');
    await page.getByPlaceholder('Your answer...').nth(1).fill('john@example.com');
    await page.getByPlaceholder('Type here...').fill('I slipped on a banana peel.');

    // Submit
    await page.getByRole('button', { name: /submit/i }).click();

    // Verify Success State
    await expect(page.getByText('Submission Received')).toBeVisible();


    // --- STEP 2: LAWYER VERIFICATION ---
    // Go to CRM Dashboard
    await page.goto('/crm');

    // 1. Open the Form Selector Dropdown
    // We find the dropdown trigger by looking for the button containing the chevron SVG
    const formSelector = page.locator('button').filter({ has: page.locator('svg path[d="M6 9l6 6 6-6"]') }).first();
    await formSelector.click();

    // 2. Select "E2E Test Form" from the list
    // [FIX] We use .last() because the dropdown item appears in the DOM *after* the trigger button
    // This resolves the "strict mode violation" where Playwright saw two buttons with the same name.
    const dropdownItem = page.getByRole('button', { name: 'E2E Test Form' }).last();
    await expect(dropdownItem).toBeVisible();
    await dropdownItem.click();

    // 3. Search for the submission
    const searchInput = page.getByPlaceholder('Search name or email...');
    await searchInput.fill('john@example.com');

    // 4. Verify the submission appears in the list
    await expect(page.getByText('John Doe')).toBeVisible();
    
    // 5. Click it to see details on the right
    await page.getByText('John Doe').click();
    
    // 6. Verify the specific answer is visible in the detail view
    await expect(page.getByText('I slipped on a banana peel.')).toBeVisible();
  });
});