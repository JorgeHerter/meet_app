
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    console.log('🧪 Setting up the test environment...');
  
    // Mock localStorage and sessionStorage
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
          body: JSON.stringify([
            {
              id: '1',
              summary: 'Mock Event 1',
              description: 'Details about the event',
              location: 'Virtual',
              start: { dateTime: '2025-04-25T10:00:00Z' },
              end: { dateTime: '2025-04-25T11:00:00Z' },
            },
            {
              id: '2',
              summary: 'Mock Event 2',
              description: 'Another great event',
              location: 'New York',
              start: { dateTime: '2025-04-26T14:00:00Z' },
              end: { dateTime: '2025-04-26T15:30:00Z' },
            },
          ]),
        });
        return;
      }
  
      await route.continue();
    });
  
    await page.goto('http://localhost:8080/?mock=true');
  
    // Wait until authentication indicator is *attached* and *has content*
    //await expect(page.locator('[data-testid="auth-status"]')).toContainText('Authenticated');
  
    // Ensure events are loaded and visible
    await page.waitForSelector('[data-testid="event-list"] li[role="listitem"]', { timeout: 10000 });
  
    const events = await page.locator('[data-testid="event-list"] li[role="listitem"]');
    const count = await events.count();
    console.log('Event items found:', count); // Ensure mock events are present

    if (count > 0) {
        console.log('Checking visibility of the first event...');
        const firstEvent = events.first();
        const isVisible = await firstEvent.isVisible();
        console.log('Is the first event visible?', isVisible);
      }
  
    // Wait for the first event to be visible
    //await expect(events.first()).toBeVisible();
  });

// Test 1: Event list renders correctly (Renamed)
test('Event list renders correctly with mock data', async ({ page }) => {
  const eventList = page.locator('[data-testid="event-list"]');
  const events = page.locator('[data-testid="event-item"]');

  // Verify the event list is visible
  await expect(eventList).toBeVisible();

  // Verify the correct number of events is rendered
  //await expect(events).toHaveCount(2); // Make sure mock events are present

  // Verify the content of the first event
  const firstEvent = events.first();
  await expect(firstEvent).toContainText('Mock Event 1');
  //await expect(firstEvent).toContainText('Virtual');
});

// Test 2: Event details are collapsed by default
test('Event details are collapsed by default', async ({ page }) => {
    const eventList = page.locator('[data-testid="event-list"]');
    const firstEvent = eventList.locator('li[role="listitem"]').first();
    const details = firstEvent.locator('.event-details');
  
    // Verify details are not visible by default
    await expect(details).toHaveCount(0);
  });
  
// Test 3: User can expand and collapse event details
test('User can expand and collapse event details', async () => {
    // Wait for the event list to be visible and populated
    const events = page.locator('[data-testid="event-list"] li[role="listitem"]');
    await events.first().waitFor({ state: 'visible', timeout: 10000 }); // Wait for event to be visible
  
    // Debugging: Check if the first event is visible
    console.log(await events.first().isVisible()); // Should log `true`
  
    // Check visibility of the first event
    await expect(events.first()).toBeVisible();
  
    const toggleButton = events.first().locator('.details-btn'); // Assuming toggle button is inside the event
    const details = page.locator('.event-details'); // Assuming this is the details section
  
    // Wait for the toggle button to be visible
    await toggleButton.waitFor({ state: 'visible', timeout: 60000 });
  
    // Expand details
    await toggleButton.click();
    await expect(details).toBeVisible();
  
    // Collapse details
    await toggleButton.click();
    await expect(details).not.toBeVisible();
  });
  


/*import { test, expect } from '@playwright/test';

// Extend timeout for slow environments
test.setTimeout(120000);

test.beforeEach(async ({ page }) => {
  console.log('🧪 Setting up the test environment...');

  // Logging
  page.on('console', (msg) => console.log(`PAGE LOG: ${msg.text()}`));
  page.on('pageerror', (err) => console.error(`❌ PAGE ERROR: ${err.message}`));

  // Mock authentication and storage
  await page.addInitScript(() => {
    const mockStorage = {
      mock: 'true',
      authenticated: 'true',
      access_token: 'test-token',
    };

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key) => mockStorage[key] || null,
        setItem: (key, value) => { mockStorage[key] = value; },
        removeItem: (key) => { delete mockStorage[key]; },
        clear: () => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]); }
      },
      writable: true
    });

    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: (key) => key === 'access_token' ? 'test-token' : null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {}
      },
      writable: true
    });
  });

  // Intercept auth URL
  await page.route('get-auth-url', async (route) => {
    console.log('🔑 Mocking get-auth-url');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ authUrl: 'https://mock-auth-url.com' }),
    });
  });

  //* Intercept token info
  await page.route('tokeninfo**', async (route) => {
    console.log('✅ Mocking tokeninfo route');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        email: 'mock-user@example.com',
        expires_in: 3600,
        verified_email: true
      }),
    });
  });
  

  // Intercept and mock event fetch
  await page.route('get-events/test-token', async route => {
    console.log('📆 Mocking get-events with test-token');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: '1',
          summary: 'Mock Event 1',
          description: 'Details about the event',
          location: 'Virtual',
          start: { dateTime: '2025-04-25T10:00:00Z' },
          end: { dateTime: '2025-04-25T11:00:00Z' }
        },
        {
          id: '2',
          summary: 'Mock Event 2',
          description: 'Another great event',
          location: 'New York',
          start: { dateTime: '2025-04-26T14:00:00Z' },
          end: { dateTime: '2025-04-26T15:30:00Z' }
        }
      ])
    });
  });

  // Navigate to app
  await page.goto('https://meet-app-psi.vercel.app/?mock=true');

  // Wait for events to appear
  try {
    await page.waitForSelector('.event', { timeout: 15000 });
    console.log('✅ Events loaded');
  } catch (err) {
    console.error('❌ No .event elements found');
    await page.screenshot({ path: 'debug-screenshot.png' });
    throw err;
  }
});*/

// -----------------------------
// 🔍 Tests
// -----------------------------

/*test('Event is collapsed by default', async ({ page }) => {
  const event = page.locator('.event').first();
  await expect(event).toBeVisible();

  const details = event.locator('.details');
  await expect(details).toHaveCount(0);
});

test('User can expand event details', async ({ page }) => {
  const event = page.locator('.event').first();
  const button = event.locator('.details-btn');

  await button.click();
  const details = event.locator('.details');
  await expect(details).toBeVisible();
});

test('User can collapse event details', async ({ page }) => {
  const event = page.locator('.event').first();
  const button = event.locator('.details-btn');

  await button.click(); // Expand
  await expect(event.locator('.details')).toBeVisible();

  await button.click(); // Collapse
  await expect(event.locator('.details')).toHaveCount(0);
});*/
