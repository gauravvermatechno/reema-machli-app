# Progressive Web App

The app is a fully installable PWA.

## Manifest
**File:** `public/manifest.json`

| Property | Value |
|----------|-------|
| name | Reema's Action Tracker |
| short_name | Machli |
| start_url | / |
| display | standalone |
| background_color | #0f766e |
| theme_color | #0f766e |
| orientation | any |

## Icons
| File | Size | Purpose |
|------|------|---------|
| `icon.svg` | Scalable | Teal circle with white fish silhouette |
| `icon-192.png` | 192x192 | Standard PWA icon |
| `icon-512.png` | 512x512 | Splash screen / large icon |

## Service Worker
**File:** `public/sw.js`
**Cache version:** `machli-v1`

### Caching Strategy
| Resource Type | Strategy | Rationale |
|--------------|----------|-----------|
| `/_next/static/` | Cache-first | Immutable hashed assets |
| `.js`, `.css`, `.png`, `.svg`, fonts | Cache-first | Rarely change |
| HTML pages | Network-first | Fresh content |
| `/api/` | Network-first | Live data |
| Fallback | `offline.html` | Graceful degradation |

### Lifecycle
```
Install -> Pre-cache: /, /offline.html, /icon.svg, /manifest.json
         -> skipWaiting()

Activate -> Clean old caches (different version prefix)
          -> clients.claim()

Fetch -> Match strategy based on URL pattern
```

### Update Flow
1. Browser checks for SW updates periodically
2. If new SW found, installs in background
3. [[Components/PWARegister]] detects `updatefound`
4. Shows toast: "New version available"
5. User taps Refresh
6. Sends `SKIP_WAITING` message
7. New SW activates, page reloads

## Offline Fallback
**File:** `public/offline.html`
- Standalone HTML page (no external dependencies)
- App branding with teal theme
- "You're offline" message
- Retry button

## Apple-Specific
- `apple-mobile-web-app-capable: yes`
- `apple-mobile-web-app-status-bar-style: black-translucent`
- `apple-mobile-web-app-title: Machli`
- `viewport-fit: cover`

## How to Install
| Platform | Steps |
|----------|-------|
| iPhone/iPad | Safari > Share > Add to Home Screen |
| Android | Chrome shows install banner, or Menu > Install App |
| Desktop | Chrome address bar install icon |

## Related
- [[Components/PWARegister]]
- [[Infrastructure/Deployment]]
- [[Infrastructure/Service Worker]]
