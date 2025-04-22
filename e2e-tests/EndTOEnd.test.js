import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://meet-app-psi.vercel.app/?mock=true');
  
    // Fake login state (if your app checks localStorage or cookies)
    await page.evaluate(() => {
      localStorage.setItem('access_token', 'test');
    });
  
    await page.reload(); // Reload to trigger app logic with token
  
    await page.waitForSelector('.event', { timeout: 60000 });
  });
  
  test('Event is collapsed by default', async () => {
    // Select the first event on the page
    const event = page.locator('.event').first();

    // Check that the event details are collapsed by default (not visible)
    const details = event.locator('.details');
    await expect(details).toHaveCount(0); // Ensure there are no details by default
  });

  test('User can expand event details', async () => {
    const event = page.locator('.event').first();
    const button = event.locator('.details-btn');

    // Click the expand button
    await button.click();

    // Wait for the details to be visible
    await expect(event.locator('.details')).toBeVisible();
  });

  test('User can collapse event details', async () => {
    const event = page.locator('.event').first();
    const button = event.locator('.details-btn');

    // Click the expand button to show details
    await button.click();
    await expect(event.locator('.details')).toBeVisible();

    // Now click the collapse button to hide the details
    await button.click();
    await expect(event.locator('.details')).toHaveCount(0); // Ensure details are collapsed
  });


