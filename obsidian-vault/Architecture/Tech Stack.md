# Tech Stack

## Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.2.3 | React framework with App Router |
| **React** | 19.2.4 | UI library |
| **TypeScript** | 5.9.3 | Type safety |
| **Tailwind CSS** | 4.2.2 | Utility-first styling |
| **Framer Motion** | 12.38.0 | Animations & transitions |
| **Lucide React** | 1.8.0 | Icon library |
| **date-fns** | 4.1.0 | Date formatting |

## Backend / Infrastructure
| Technology | Purpose |
|------------|---------|
| **Vercel** | Hosting & deployment |
| **Vercel Blob** | Persistent JSON storage |
| **localStorage** | Client-side cache & fallback |
| **Service Worker** | PWA offline support |

## Development
| Tool | Purpose |
|------|---------|
| **pnpm** | Package manager |
| **Playwright** | E2E testing |
| **ESLint** | Code linting |
| **Turbopack** | Build bundler (via Next.js) |

## Key Patterns
- **App Router** - File-based routing under `src/app/`
- **"use client"** - All pages are client components (localStorage, animations)
- **Custom Hook** - `useTasks()` for shared state + persistence
- **Debounced Sync** - 800ms debounce on API saves
- **Cache-first SW** - Static assets cached, API calls network-first

## Related
- [[Architecture/Directory Structure]]
- [[Project Overview]]
