import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Load the compiled pixel code
const pixelCode = fs.readFileSync(path.join(__dirname, '../../public/tracking.js'), 'utf8');

test.describe('Pixel "In the Wild" Behavior', () => {

  test('should HARVEST ad cookies and bridge identity', async ({ page }) => {
    // 1. Simulate a User arriving via Google Ads
    await page.context().addCookies([
      { name: '_fbp', value: 'fb.1.123456789', domain: 'localhost', path: '/' },
      { name: '_gcl_au', value: '1.1.555555', domain: 'localhost', path: '/' }
    ]);
    
    // 2. Mock the Client Site + Inject Pixel
    await page.route('http://localhost:8080/', async route => {
      const html = `
        <html>
          <head>
            <script>
              window.MW_CONFIG = { publicKey: 'pk_e2e_test', endpoint: 'http://localhost:3000/api/v1/track' };
            </script>
            <script>${pixelCode}</script>
          </head>
          <body>
            <h1>Law Firm Landing Page</h1>
            <button id="submit">Submit Lead</button>
          </body>
        </html>
      `;
      await route.fulfill({ body: html });
    });

    // 3. Spy on the Network Request to the Engine
    const requestPromise = page.waitForRequest(req => req.url().includes('/api/v1/track') && req.method() === 'POST');

    await page.goto('http://localhost:8080/?gclid=TesT_GCLID_Value');

    const request = await requestPromise;
    const payload = request.postDataJSON();

    // 4. ASSERTION: The "Golden Keys" were extracted
    expect(payload.click.gclid).toBe('TesT_GCLID_Value'); // URL Param
    expect(payload.cookies._fbp).toBe('fb.1.123456789');   // Cookie
    expect(payload.cookies._gcl_au).toBe('1.1.555555');    // Cookie
    expect(payload.context.title).toBe('Law Firm Landing Page');
  });

  test('should FALLBACK to Direct API if Proxy fails (The Anti-AdBlocker)', async ({ page }) => {
    // 1. Simulate Client Site with a BROKEN Proxy config
    await page.route('http://localhost:8080/', async route => {
      await route.fulfill({ body: `
        <script>
          window.MW_CONFIG = { 
            publicKey: 'pk_test', 
            endpoint: '/broken-proxy' // This will 404
          };
        </script>
        <script>${pixelCode}</script>
      `});
    });

    // 2. Mock the 404 on the proxy
    await page.route('http://localhost:8080/broken-proxy', route => route.fulfill({ status: 404 }));

    // 3. Expect a call to the DIRECT SaaS endpoint (localhost:3000 in dev)
    const fallbackRequest = page.waitForRequest(req => 
      req.url().includes('localhost:3000/api/v1/track')
    );

    await page.goto('http://localhost:8080/');
    const req = await fallbackRequest;
    
    expect(req).toBeTruthy();
    console.log('✅ Pixel successfully bypassed broken proxy!');
  });
});