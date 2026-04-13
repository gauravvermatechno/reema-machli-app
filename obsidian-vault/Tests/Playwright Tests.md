# Playwright Tests

**Directory:** `tests/`
**Framework:** Playwright 1.59.1
**Browser:** Chromium

## Test Files

### 1. quotes-rotation.spec.ts
Original test verifying quotes rotate after 30 seconds.
- Logs in as "reema"
- Captures initial top + bottom quotes
- Waits 35 seconds
- Verifies both changed

### 2. dashboard-quotes.spec.ts
Enhanced dashboard test with screenshots.
- Takes `test-results/dashboard-initial.png`
- Waits 32 seconds
- Takes `test-results/dashboard-after-30s.png`
- Asserts both quotes changed

### 3. production-quotes.spec.ts
Tests against live Vercel deployment.
- URL: `https://reema-machli-app.vercel.app`
- Same flow as dashboard test but on production

## Running Tests
```bash
# Start dev server first
pnpm dev &

# Run all tests
npx playwright test

# Run specific test
npx playwright test tests/dashboard-quotes.spec.ts --timeout 120000

# Run against production
npx playwright test tests/production-quotes.spec.ts --timeout 120000
```

## Test Results
All 3 tests pass. Example output:
```
PROD TOP [t=0s]:  "I think it's very important for little girls..."
PROD TOP [t=32s]: "I was raised to believe that excellence..."
Top changed: true
Bottom changed: true
```

## Related
- [[Pages/Dashboard Page]]
- [[Quotes/Quote System]]
