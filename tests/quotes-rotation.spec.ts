import { test, expect } from '@playwright/test';

test.describe('Quote rotation on dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Login
    const input = page.locator('input[type="text"]');
    await input.fill('reema');
    await page.locator('button[type="submit"]').click();
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('quotes should rotate after 30 seconds', async ({ page }) => {
    // Find the blockquote (bottom inspirational quote)
    const blockquote = page.locator('blockquote');
    await expect(blockquote).toBeVisible({ timeout: 5000 });
    const initialQuote = await blockquote.textContent();
    console.log('Initial quote:', initialQuote?.substring(0, 80));

    // Also find the top small quote area - look for italic text in teal section
    const topQuoteArea = page.locator('.bg-teal-50 .italic');
    let initialTopQuote = '';
    if (await topQuoteArea.count() > 0) {
      initialTopQuote = (await topQuoteArea.first().textContent()) || '';
      console.log('Initial top quote:', initialTopQuote.substring(0, 80));
    }

    // Wait 35 seconds
    console.log('Waiting 35s for quote rotation...');
    await page.waitForTimeout(35000);

    // Check bottom quote changed
    const newQuote = await blockquote.textContent();
    console.log('New quote:', newQuote?.substring(0, 80));
    expect(newQuote).not.toBe(initialQuote);

    // Check top quote changed
    if (initialTopQuote && await topQuoteArea.count() > 0) {
      const newTopQuote = await topQuoteArea.first().textContent();
      console.log('New top quote:', newTopQuote?.substring(0, 80));
      expect(newTopQuote).not.toBe(initialTopQuote);
    }

    console.log('PASS: Quotes rotated successfully!');
  });
});
