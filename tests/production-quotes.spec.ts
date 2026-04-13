import { test, expect } from '@playwright/test';

const PROD_URL = 'https://reema-machli-app.vercel.app';

test('production dashboard quotes rotate', async ({ page }) => {
  // Login on production
  await page.goto(PROD_URL);
  await page.waitForLoadState('networkidle');
  await page.locator('input[type="text"]').fill('reema');
  await page.locator('button[type="submit"]').click();
  await page.waitForURL('**/dashboard', { timeout: 15000 });
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'test-results/prod-initial.png', fullPage: true });

  const topQuote = page.locator('.bg-teal-50 p.italic').first();
  const bottomQuote = page.locator('blockquote').first();

  const initialTop = (await topQuote.textContent()) || '';
  const initialBottom = (await bottomQuote.textContent()) || '';
  console.log('PROD TOP [t=0s]:', initialTop.substring(0, 80));
  console.log('PROD BOTTOM [t=0s]:', initialBottom.substring(0, 80));

  console.log('Waiting 32 seconds...');
  await page.waitForTimeout(32000);

  await page.screenshot({ path: 'test-results/prod-after-30s.png', fullPage: true });

  const newTop = (await topQuote.textContent()) || '';
  const newBottom = (await bottomQuote.textContent()) || '';
  console.log('PROD TOP [t=32s]:', newTop.substring(0, 80));
  console.log('PROD BOTTOM [t=32s]:', newBottom.substring(0, 80));

  const topChanged = newTop !== initialTop;
  const bottomChanged = newBottom !== initialBottom;
  console.log('Top changed:', topChanged);
  console.log('Bottom changed:', bottomChanged);

  expect(topChanged || bottomChanged, 'At least one quote should rotate').toBeTruthy();
});
