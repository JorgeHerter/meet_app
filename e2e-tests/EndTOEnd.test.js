
import { test, expect } from '@playwright/test';

test.describe('E2E Event Tests', () => {
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
  });

  // Test 1: Event list renders correctly
  test('Event list renders correctly with mock data', async ({ page }) => {
    const eventList = page.locator('[data-testid="event-list"]');
    const events = page.locator('[data-testid="event-item"]');

    await expect(eventList).toBeVisible();
    await expect(events.first()).toContainText('Mock Event 1');
  });

  // Test 2: Event details are collapsed by default
  test('Event details are collapsed by default', async ({ page }) => {
    const firstEvent = page.locator('[data-testid="event-list"] li[role="listitem"]').first();
    const details = firstEvent.locator('.event-details');
    await expect(details).toHaveCount(0);
  });

  // Test 3: User can expand and collapse event details
  test('User can expand and collapse event details', async ({ page }) => {
    const events = page.locator('[data-testid="event-list"] li[role="listitem"]');
    await events.first().waitFor({ state: 'visible', timeout: 15000 });

    const toggleButton = events.first().locator('.details-button');
    const details = events.first().locator('.event-details');

    await toggleButton.click();
    await expect(details).toBeVisible();

    await toggleButton.click();
    await expect(details).toHaveCount(0);
  });

  // Test 4: User can search and select a city
  test('User can search and select a city from suggestions', async ({ page }) => {
    const input = page.locator('[data-testid="city-input"]');
    await input.waitFor({ state: 'visible', timeout: 5000 });

    await input.click();
    await input.fill('vir');

    const suggestions = page.locator('[data-testid="city-suggestion-item"]');
    await expect(suggestions.first()).toContainText('Virtual');

    await suggestions.first().click();
    await expect(input).toHaveValue('Virtual');
  });
});

  

  

                                            