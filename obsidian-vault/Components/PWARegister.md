# PWARegister Component

**File:** `src/components/PWARegister.tsx` (129 lines)
**Directive:** `"use client"`

## Purpose
Registers the service worker and shows update notifications.

## Behavior
1. On mount (production only), registers `/sw.js`
2. Listens for `updatefound` lifecycle event
3. When a new SW is installed while existing one controls the page:
   - Shows a fixed-bottom toast: "New version available"
   - Refresh button sends `SKIP_WAITING` to waiting worker
   - Page reloads via `controllerchange` event
4. Guards against double-reload

## UI
- Fixed bottom toast bar
- "New version available" text
- "Refresh" button
- `role="alert"` and `aria-live="polite"` for accessibility

## Registration Flow
```
Mount -> navigator.serviceWorker.register("/sw.js")
    -> onUpdateFound -> track installing worker
    -> onStateChange("installed") + existing controller
    -> Show update toast
    -> User clicks Refresh
    -> postMessage({ type: "SKIP_WAITING" })
    -> controllerchange -> window.location.reload()
```

## Related
- [[Infrastructure/PWA]]
- [[Infrastructure/Service Worker]]
