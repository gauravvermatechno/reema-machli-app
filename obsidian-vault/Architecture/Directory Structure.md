# Directory Structure

```
reema-machli-app/
+-- public/
|   +-- manifest.json          # PWA manifest
|   +-- sw.js                  # Service worker
|   +-- offline.html           # Offline fallback page
|   +-- icon.svg               # App icon (fish in teal circle)
|   +-- icon-192.png           # PWA icon 192x192
|   +-- icon-512.png           # PWA icon 512x512
|
+-- src/
|   +-- app/
|   |   +-- layout.tsx         # Root layout (fonts, PWA meta, viewport)
|   |   +-- globals.css        # Global styles, scrollbar, animations
|   |   +-- page.tsx           # Login page (/)
|   |   +-- dashboard/
|   |   |   +-- page.tsx       # Dashboard (/dashboard)
|   |   +-- tasks/
|   |   |   +-- page.tsx       # Task manager (/tasks)
|   |   +-- api/
|   |       +-- tasks/
|   |           +-- route.ts   # GET/PUT tasks API
|   |
|   +-- components/
|   |   +-- SwimmingFish.tsx   # Interactive fish animation
|   |   +-- PWARegister.tsx    # Service worker registration
|   |
|   +-- lib/
|       +-- types.ts           # TypeScript interfaces
|       +-- data.ts            # Seed data, status config, quotes re-export
|       +-- useTasks.ts        # Shared task state hook
|       +-- quotes/
|           +-- index.ts       # Combines all 997 quotes
|           +-- athletes.ts    # 100 athlete quotes
|           +-- poets.ts       # 97 poet/writer quotes
|           +-- leaders.ts     # 92 leader quotes
|           +-- scientists.ts  # 90 scientist quotes
|           +-- business.ts    # 100 business/entertainment quotes
|           +-- activists.ts   # 81 activist quotes
|           +-- indian.ts      # 98 Indian women quotes
|           +-- historical.ts  # 100 historical women quotes
|           +-- modern.ts      # 99 modern women quotes
|           +-- bengali.ts     # 140 Bengali quotes (in Bengali script)
|
+-- tests/
|   +-- dashboard-quotes.spec.ts     # Quote rotation test (local)
|   +-- production-quotes.spec.ts    # Quote rotation test (prod)
|   +-- quotes-rotation.spec.ts      # Original rotation test
|
+-- QUOTE_REVIEW.md            # Accuracy audit report
+-- next.config.ts             # Next.js configuration
+-- tailwind.config.ts         # Tailwind configuration (v4)
+-- tsconfig.json              # TypeScript configuration
+-- package.json               # Dependencies & scripts
```

## File Counts
| Category | Files | Total Lines |
|----------|-------|-------------|
| Pages | 3 | ~2,366 |
| Components | 2 | ~310 |
| Library/Data | 14 | ~8,370 |
| API Routes | 1 | 57 |
| Tests | 3 | ~150 |
| Config/Public | 8 | ~300 |
| **Total** | **31** | **~11,553** |

## Related
- [[Architecture/Tech Stack]]
- [[Architecture/Data Flow]]
