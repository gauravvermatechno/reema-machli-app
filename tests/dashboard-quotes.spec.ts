import { test, expect } from '@playwright/test';

test('dashboard quotes rotate every 30s', async ({ page }) => {
  // Login
  await page.goto('http://localhost:3000');
  await page.locator('input[type="text"]').fill('reema');
  await page.locator('button[type="submit"]').click();
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  await page.waitForTimeout(3000);

  // Screenshot initial state
  await page.screenshot({ path: 'test-results/dashboard-initial.png', fullPage: true });

  // Get ALL text content that looks like quotes
  const topQuote = page.locator('.bg-teal-50 p.italic').first();
  const bottomQuote = page.locator('blockquote').first();

  const topVisible = await topQuote.isVisible().catch(() => false);
  const bottomVisible = await bottomQuote.isVisible().catch(() => false);

  console.log('Top quote visible:', topVisible);
  console.log('Bottom quote visible:', bottomVisible);

  let initialTop = '';
  let initialBottom = '';

  if (topVisible) {
    initialTop = (await topQuote.textContent()) || '';
    console.log('TOP QUOTE [t=0s]:', initialTop);
  }
  if (bottomVisible) {
    initialBottom = (await bottomQuote.textContent()) || '';
    console.log('BOTTOM QUOTE [t=0s]:', initialBottom);
  }

  // Wait 32 seconds
  console.log('Waiting 32 seconds...');
  await page.waitForTimeout(32000);

  // Screenshot after rotation
  await page.screenshot({ path: 'test-results/dashboard-after-30s.png', fullPage: true });

  let newTop = '';
  let newBottom = '';

  if (topVisible) {
    newTop = (await topQuote.textContent()) || '';
    console.log('TOP QUOTE [t=32s]:', newTop);
  }
  if (bottomVisible) {
    newBottom = (await bottomQuote.textContent()) || '';
    console.log('BOTTOM QUOTE [t=32s]:', newBottom);
  }

  // Verify rotation happened
  if (initialTop) {
    expect(newTop, 'Top quote should have changed').not.toBe(initialTop);
  }
  if (initialBottom) {
    expect(newBottom, 'Bottom quote should have changed').not.toBe(initialBottom);
  }

  console.log('RESULT: Quotes rotated successfully!');
});
