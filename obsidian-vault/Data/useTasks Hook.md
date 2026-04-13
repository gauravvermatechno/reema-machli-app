# useTasks Hook

**File:** `src/lib/useTasks.ts` (87 lines)
**Type:** Custom React Hook

## Signature
```typescript
function useTasks(): {
  tasks: Task[];
  updateTasks: (updater: Task[] | ((prev: Task[]) => Task[])) => void;
  loading: boolean;
}
```

## Loading Strategy (priority order)
1. **Fetch from API** (`GET /api/tasks`)
   - If remote data exists, use it and sync to localStorage
2. **Fall back to localStorage** (`reema-tasks` key)
   - Parse and deserialize dates
3. **Seed with defaults** (`initialTasks` from data.ts)
   - Save to localStorage for future

## Persistence Strategy
On every `updateTasks()` call:
1. **Immediate:** Save to localStorage (instant UX)
2. **Debounced (800ms):** PUT to `/api/tasks` (cloud persistence)
   - Silently fails if API unavailable

## Date Handling
Task `deadlineDate` fields are serialized as ISO strings in JSON. The `deserializeTasks()` helper reconstructs them as `Date` objects on load.

## Used By
- [[Pages/Dashboard Page]] - reads `tasks` and `loading`
- [[Pages/Tasks Page]] - reads `tasks`, `loading`, uses `updateTasks`

## Related
- [[API/Tasks Route]]
- [[Architecture/Data Flow]]
