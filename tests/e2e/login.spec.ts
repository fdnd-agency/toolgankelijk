import { test, expect } from '@playwright/test';

test('e2e-logintest', async ({ page }) => {
	await page.goto('http://localhost:5173/login');
	await expect(page.getByRole('group', { name: 'Login' })).toBeVisible();
});
