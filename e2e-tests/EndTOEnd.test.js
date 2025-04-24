
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    
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
    
  
      if (url.includes('oauth2') || url.includes('accounts.google.com')) {
        await route.abort();
        return;
      }
  
      if (url.includes('tokeninfo')) {
        
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ email: 'mock-user@example.com', expires_in: 3600 }),
        });
        return;
      }
  
      if (url.includes('events') || url.includes('calendar')) {
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
    //await page.waitForSelector('[data-testid="event-list"] li[role="listitem"]', { timeout: 10000 });
  
    const events = await page.locator('[data-testid="event-list"] li[role="listitem"]');
    const count = await events.count();
    

    if (count > 0) {
        const firstEvent = events.first();
        const isVisible = await firstEvent.isVisible();
    
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
test('User can expand and collapse event details', async ({ page }) => {
    // Mock the API response
    await page.route('**/api/events', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            summary: 'Test Event 1',
            location: 'Test Location',
            created: '2023-01-01T10:00:00Z',
            start: { dateTime: '2023-01-15T10:00:00Z' },
            description: 'Test Description',
            hangoutLink: 'https://meet.google.com/test'
          },
          {
            id: '2',
            summary: 'Test Event 2',
            location: 'Another Location',
            created: '2023-01-02T11:00:00Z',
            start: { dateTime: '2023-01-16T14:00:00Z' },
            description: 'Another Test Description',
            hangoutLink: 'https://meet.google.com/test2'
          }
        ])
      });
    });
  
    // Navigate to the page (ensure this matches your actual URL)
    await page.goto('http://localhost:8080');
  
    // Wait for the event list to be visible
    const events = page.locator('[data-testid="event-list"] li[role="listitem"]');
    await events.first().waitFor({ state: 'visible', timeout: 15000 });
  
    const toggleButton = events.first().locator('.details-button');
    const details = events.first().locator('.event-details');
  
    // Expand
    await toggleButton.click();
    await expect(details).toBeVisible();
  
    // Collapse
    await toggleButton.click();
    await expect(details).toHaveCount(0);
  });
  

                                            