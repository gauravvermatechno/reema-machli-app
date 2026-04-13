# Data Flow

## Authentication Flow
```
User enters username
        |
        v
page.tsx validates (case-insensitive === "reema")
        |
        v
Sets localStorage: "reema-auth" = "authenticated"
        |
        v
router.push("/dashboard")
```

All protected pages check `localStorage.getItem("reema-auth")` on mount and redirect to `/` if missing.

## Task Data Flow
```
                   +------------------+
                   |   useTasks()     |
                   |   Custom Hook    |
                   +--------+---------+
                            |
              +-------------+-------------+
              |                           |
    +---------v---------+      +----------v----------+
    |   localStorage    |      |   Vercel Blob API   |
    |   (instant cache) |      |   (cloud persist)   |
    +-------------------+      +---------------------+
              ^                           ^
              |                           |
              +------ On page load -------+
              |  1. Try API first         |
              |  2. Fall back to local    |
              |  3. Seed from initialTasks|
              +---------------------------+

              +------ On mutation --------+
              |  1. Update React state    |
              |  2. Save to localStorage  |
              |  3. Debounce 800ms -> API |
              +---------------------------+
```

## Quote Rotation Flow
```
quotes/index.ts combines all 997 quotes
        |
        v
data.ts re-exports as `quotes`
        |
        v
dashboard/page.tsx imports `quotes` + `bengaliQuotes`
        |
        v
useEffect setInterval(10000ms)
        |
        v
Every tick: increment topQuoteIdx + bottomQuoteIdx
        |
        v
Every 3rd tick (tickCount % 3 === 2):
    Show bengaliQuotes[bengaliIdx] instead
        |
        v
AnimatePresence fade transition between quotes
```

## API Route: /api/tasks
```
GET /api/tasks
    -> list Vercel Blob (prefix: "reema-tasks.json")
    -> fetch blob URL
    -> return { tasks: [...] }
    -> fallback: { tasks: null }

PUT /api/tasks
    -> receive { tasks: [...] } body
    -> put to Vercel Blob (path: "reema-tasks.json")
    -> cleanup old blobs
    -> return { success: true }
```

## Service Worker Strategy
```
Static assets (JS, CSS, images, fonts):
    -> Cache-first (fast loads)

HTML pages, API calls:
    -> Network-first (fresh data)
    -> Fallback to cache
    -> Ultimate fallback: offline.html
```

## Related
- [[Data/useTasks Hook]]
- [[API/Tasks Route]]
- [[Quotes/Quote System]]
