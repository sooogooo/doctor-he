import { test, expect } from '@playwright/test';

test.describe('Aura AI Application', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');

    // Check that the app loads
    await expect(page.locator('#root')).toBeVisible();
  });

  test('should display the header', async ({ page }) => {
    await page.goto('/');

    // Wait for the app to fully load
    await page.waitForLoadState('networkidle');

    // Check for header elements
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('should navigate to settings', async ({ page }) => {
    await page.goto('/');

    // Wait for app to load
    await page.waitForLoadState('networkidle');

    // Click on settings button (if visible)
    const settingsButton = page.locator('[aria-label*="设置"]');
    if (await settingsButton.isVisible()) {
      await settingsButton.click();

      // Settings view should be visible
      await expect(page.locator('text=设置')).toBeVisible();
    }
  });

  test('should have responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.locator('#root')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('#root')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator('#root')).toBeVisible();
  });

  test('should display tab bar navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for tab bar
    const tabBar = page.locator('nav');
    await expect(tabBar).toBeVisible();
  });
});
