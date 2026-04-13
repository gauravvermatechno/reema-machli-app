# Login Page

**Route:** `/`
**File:** `src/app/page.tsx` (284 lines)
**Directive:** `"use client"`

## Purpose
Entry point of the app. Authenticates user with hardcoded username.

## Authentication
- **Username:** `reema` (case-insensitive)
- **No password required**
- Stores `reema-auth` and `reema-user` in localStorage on success
- Redirects to [[Dashboard Page]] on success
- Auto-redirects to dashboard if already authenticated

## Visual Design
- **Background:** 135-degree gradient from deep teal (#0d4b4a) through emerald to warm amber (#c98b3a)
- **Two animated ambient orbs** (gold + teal) pulsing with framer-motion
- **SVG noise texture overlay** for premium tactile feel
- **Frosted glass card:** `backdrop-filter: blur(24px) saturate(1.4)`, semi-transparent white, rounded-3xl
- **Inspirational quote** from Amelia Earhart at bottom of card

## Animations
- Card entrance: fade up + scale from 0.96
- Staggered reveals for header, form, quote sections
- AnimatePresence for error message enter/exit
- Button micro-interactions (whileHover, whileTap)
- Loading spinner on submit

## Accessibility
- Proper `<label>` linked to input
- `aria-describedby` on error
- `aria-invalid` on input
- `role="alert"` on error message
- Auto-focus on input

## Related
- [[Dashboard Page]]
- [[Architecture/Data Flow]]
