# Seed Data

**File:** `src/lib/data.ts` (299 lines)

## Initial Tasks
22 tasks seeded from the Consolidated Action Tracker image. Loaded on first visit when no saved data exists.

### By Owner
| Owner | Tasks |
|-------|-------|
| Reema | 13 |
| Jacek | 6 |
| J + R + Gosia | 1 |
| Team | 2 |

### By Status
| Status | Count | Color |
|--------|-------|-------|
| Done | 2 | Emerald |
| In progress | 1 | Blue |
| New | 9 | Purple |
| Carried fwd | 6 | Amber |
| Due | 1 | Red |
| Scheduled | 1 | Cyan |
| On hold | 1 | Gray |

## Status Colors
```typescript
statusColors: Record<string, string>
// Maps status -> Tailwind bg/text/border classes
// e.g., 'Done' -> 'bg-emerald-100 text-emerald-800 border-emerald-200'
```

## Status Emoji
```typescript
statusEmoji: Record<string, string>
// Maps status -> emoji
// e.g., 'Done' -> checkmark, 'In progress' -> runner, 'Due' -> fire
```

## Quotes Re-export
```typescript
export const quotes = allQuotes; // 997 quotes from quotes/index.ts
```

## Related
- [[Data/Types]]
- [[Data/useTasks Hook]]
- [[Quotes/Quote System]]
