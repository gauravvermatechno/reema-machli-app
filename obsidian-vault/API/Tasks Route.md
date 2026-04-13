# Tasks API Route

**File:** `src/app/api/tasks/route.ts` (57 lines)
**Route:** `/api/tasks`

## GET /api/tasks
Retrieves tasks from Vercel Blob storage.

```
1. List blobs with prefix "reema-tasks.json"
2. If found, fetch the blob URL and parse JSON
3. Return { tasks: [...] }
4. If not found or error, return { tasks: null }
```

## PUT /api/tasks
Saves tasks to Vercel Blob storage.

```
1. Parse request body: { tasks: [...] }
2. Write to blob path "reema-tasks.json" (addRandomSuffix: false)
3. Clean up old blobs with different pathnames
4. Return { success: true }
5. On error, return 500 { success: false }
```

## Blob Configuration
- **Store:** `reema-tasks-store` (store_BDX8pliIFSTKxuFT)
- **Region:** iad1 (Washington DC)
- **Access:** public
- **Env var:** `BLOB_READ_WRITE_TOKEN` (set in Vercel project)

## Dependencies
- `@vercel/blob` - `put`, `head`, `list`, `del`

## Related
- [[Data/useTasks Hook]]
- [[Infrastructure/Deployment]]
- [[Architecture/Data Flow]]
