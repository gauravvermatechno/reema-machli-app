# Deployment

**Platform:** Vercel
**URL:** https://reema-machli-app.vercel.app
**Region:** iad1 (Washington DC)
**GitHub:** https://github.com/gauravvermatechno/reema-machli-app

## Vercel Project
- **Project ID:** prj_3u0RvuJdSnCY0WfoJqTx8doX97CX
- **Team:** gaurav-vermas-projects-bd324268
- **Framework:** Next.js (auto-detected)
- **Node:** 24.x
- **Build command:** `pnpm run build`

## Vercel Blob Store
- **Store name:** reema-tasks-store
- **Store ID:** store_BDX8pliIFSTKxuFT
- **Region:** iad1
- **Env var:** `BLOB_READ_WRITE_TOKEN`
- **Connected envs:** Production, Preview

## Deploy Workflow
```bash
# From project root
git add . && git commit -m "message"
git push origin main
vercel --prod --yes
```
GitHub is connected, so pushes also trigger auto-deploys.

## Environment Variables
| Variable | Environments | Source |
|----------|-------------|--------|
| BLOB_READ_WRITE_TOKEN | Production, Preview | Vercel Blob store |

## Build Output
```
Route (app)
+-- static  /              (Login)
+-- static  /_not-found
+-- dynamic /api/tasks     (API)
+-- static  /dashboard
+-- static  /tasks
```

## Related
- [[Infrastructure/PWA]]
- [[API/Tasks Route]]
- [[Architecture/Tech Stack]]
