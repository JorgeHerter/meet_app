/*import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    // Use URL parameter for mock mode
    await page.goto('https://meet-app-psi.vercel.app/?mock=true');
  
    // Wait for event cards to be loaded
    await page.waitForSelector('.event', { timeout: 60000 });
  });

test('Event is collapsed by default', async ({ page }) => {
  const event = page.locator('.event').first();
  const details = event.locator('.details');

  await expect(details).toHaveCount(0); // Details should not be visible by default
});

test('User can expand event details', async ({ page }) => {
  const event = page.locator('.event').first();
  const button = event.locator('.details-btn');

  await button.click();
  await expect(event.locator('.details')).toBeVisible(); // Should show details
});

test('User can collapse event details', async ({ page }) => {
  const event = page.locator('.event').first();
  const button = event.locator('.details-btn');

  await button.click(); // Expand
  await expect(event.locator('.details')).toBeVisible();

  await button.click(); // Collapse
  await expect(event.locator('.details')).toHaveCount(0); // Should be hidden again
});*/
import { test, expect } from '@playwright/test';

// Increase timeouts and add debug logging
test.setTimeout(120000); // 2 minutes

// Mock event data
const mockEvents = [
  {
    id: "mock-event-1",
    summary: "React Conference 2025",
    location: "San Francisco, CA",
    description: "Annual conference for React developers featuring workshops and talks",
    start: { dateTime: new Date(Date.now() + 86400000).toISOString() },
    end: { dateTime: new Date(Date.now() + 90000000).toISOString() }
  },
  {
    id: "mock-event-2",
    summary: "JavaScript Meetup",
    location: "Online",
    description: "Monthly meetup for JavaScript enthusiasts to discuss latest trends",
    start: { dateTime: new Date(Date.now() + 172800000).toISOString() },
    end: { dateTime: new Date(Date.now() + 176400000).toISOString() }
  },
  {
    id: "mock-event-3",
    summary: "Tech Workshop",
    location: "Chicago, IL",
    description: "Hands-on workshop focusing on modern web development practices",
    start: { dateTime: new Date(Date.now() + 259200000).toISOString() },
    end: { dateTime: new Date(Date.now() + 262800000).toISOString() }
  }
];

test.beforeEach(async ({ page }) => {
    console.log('🧪 Setting up the test environment...');
  
    // Setup logging
    page.on('console', (msg) => console.log(`PAGE LOG: ${msg.text()}`));
    page.on('pageerror', (err) => console.error(`❌ PAGE ERROR: ${err.message}`));
  
    // Inject mock flags before navigation
    await page.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: (key) => (key === 'mock' ? 'true' : null),
          setItem: () => {},
          removeItem: () => {},
          clear: () => {},
        },
        writable: true,
      });
  
      Object.defineProperty(window, 'sessionStorage', {
        value: {
          getItem: (key) => (key === 'access_token' ? 'test-token' : null),
          setItem: () => {},
          removeItem: () => {},
          clear: () => {},
        },
        writable: true,
      });
    });
  
    // Intercept and mock network requests
    await page.route('**/*', async (route) => {
      const url = route.request().url();
      console.log(`Intercepted request to: ${url}`);
  
      if (url.includes('oauth2') || url.includes('accounts.google.com')) {
        console.log('🔒 Intercepted OAuth request, aborting...');
        await route.abort();
        return;
      }
  
      if (url.includes('tokeninfo')) {
        console.log('✅ Intercepted token validation, returning fake user');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ email: 'mock-user@example.com', expires_in: 3600 }),
        });
        return;
      }
  
      if (url.includes('events') || url.includes('calendar')) {
        console.log('📆 Intercepted calendar API, returning mock events');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ items: mockEvents }),
        });
        return;
      }
  
      await route.continue();
    });
  
    // Navigate to the app
    await page.goto('https://meet-app-psi.vercel.app/?mock=true');
  
    // Wait for events to load
    try {
      await page.waitForSelector('.event', { timeout: 10000 });
      console.log('✅ Found .event elements');
    } catch (error) {
      console.error('❌ Could not find .event elements, taking screenshot...');
      await page.screenshot({ path: 'debug-screenshot.png' });
      throw error;
    }
  });

test('Event is collapsed by default', async ({ page }) => {
  const event = page.locator('.event').first();
  await expect(event).toBeVisible();

  const details = event.locator('.details');
  await expect(details).toHaveCount(0);
});

test('User can expand event details', async ({ page }) => {
  const event = page.locator('.event').first();
  await expect(event).toBeVisible();

  const button = event.locator('.details-btn');
  await button.click();

  const details = event.locator('.details');
  await expect(details).toBeVisible();
});

test('User can collapse event details', async ({ page }) => {
  const event = page.locator('.event').first();
  await expect(event).toBeVisible();

  const button = event.locator('.details-btn');
  await button.click(); // expand
  await expect(event.locator('.details')).toBeVisible();

  await button.click(); // collapse
  await expect(event.locator('.details')).toHaveCount(0);
});
