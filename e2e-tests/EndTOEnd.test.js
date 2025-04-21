// e2e/EndToEnd.test.js
import { test, expect } from '@playwright/test';

test.describe('Meet App E2E on Deployed Site', () => {

  test.beforeEach(async ({ page }) => {
    // Clear cookies and storage to avoid redirection during login
    await page.context().clearCookies();
    
    // Clear localStorage and sessionStorage manually
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Ensure we're loading the correct URL with mock=true
    await page.goto('https://meet-app-psi.vercel.app/?mock=true');
    
    // Wait for the .event selector to ensure that the event is loaded on the page
    await page.waitForSelector('.event', { timeout: 60000 }); // Increase timeout for page load
  });

  test('Event is collapsed by default', async ({ page }) => {
    // Select the first event on the page
    const event = page.locator('.event').first();

    // Check that the event details are collapsed by default (not visible)
    const details = event.locator('.details');
    await expect(details).toHaveCount(0); // Ensure there are no details by default
  });

  test('User can expand event details', async ({ page }) => {
    const event = page.locator('.event').first();
    const button = event.locator('.details-btn');

    // Click the expand button
    await button.click();

    // Wait for the details to be visible
    await expect(event.locator('.details')).toBeVisible();
  });

  test('User can collapse event details', async ({ page }) => {
    const event = page.locator('.event').first();
    const button = event.locator('.details-btn');

    // Click the expand button to show details
    await button.click();
    await expect(event.locator('.details')).toBeVisible();

    // Now click the collapse button to hide the details
    await button.click();
    await expect(event.locator('.details')).toHaveCount(0); // Ensure details are collapsed
  });

});



