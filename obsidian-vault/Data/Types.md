# Types

**File:** `src/lib/types.ts` (29 lines)

## TaskStatus
```typescript
type TaskStatus = 'Done' | 'In progress' | 'New' | 'Carried fwd' | 'Due' | 'Scheduled' | 'On hold';
```

## SubTask
```typescript
interface SubTask {
  id: string;
  title: string;
  hoursRequired: number;
  completed: boolean;
}
```

## Task
```typescript
interface Task {
  id: string;
  owner: string;
  action: string;
  deadline: string;        // Display label ("w/c 14 Apr", "TBD")
  deadlineDate: Date | null; // Actual date for sorting
  status: TaskStatus;
  subtasks: SubTask[];
}
```

## Quote
```typescript
interface Quote {
  text: string;
  author: string;
  role: string;
  imageUrl: string;   // Wikipedia portrait URL or ""
  gradient: string;   // Tailwind gradient classes
  emoji: string;      // Relevant emoji
}
```

## OWNERS
```typescript
const OWNERS = ['Reema', 'Jacek', 'J + R + Gosia', 'Team'] as const;
```
Used in the task modal dropdown.

## Related
- [[Data/Seed Data]]
- [[Data/useTasks Hook]]
- [[Quotes/Quote System]]
