# Dashboard Page

**Route:** `/dashboard`
**File:** `src/app/dashboard/page.tsx` (661 lines)
**Directive:** `"use client"`

## Purpose
Main dashboard showing task progress, statistics, and rotating inspirational quotes.

## Auth Guard
Checks `localStorage("reema-auth")` on mount, redirects to `/` if missing.

## Layout
- **Sidebar** (w-64): App name with fish icon, nav links (Dashboard, Tasks), logout button
- **Main content**: Scrollable dashboard area

## Sections

### 1. Top Bar
- "Welcome back, Reema" with formatted date
- **Rotating quote card** (teal background) with woman's portrait, changes every 10s

### 2. Stats Cards (4 cards)
| Card | Color | Data |
|------|-------|------|
| Total Tasks | teal | `tasks.length` |
| Completed | green | status === 'Done' |
| In Progress | blue | status === 'In progress' |
| Hours Remaining | amber | Sum of incomplete subtask hours |

### 3. Progress Ring
- 220px SVG circular progress ring
- Animated with framer-motion (0 to actual %)
- Emerald gradient stroke
- Shows "X of Y subtasks completed"

### 4. Tasks by Status
- Horizontal stacked bar chart
- Color-coded segments per status
- Legend with counts

### 5. Tasks by Owner
- Sorted list with proportional progress bars

### 6. Upcoming Deadlines
- Table of next 5 tasks (excluding Done + null dates)
- Shows owner, action (truncated), deadline, status badge

### 7. Inspirational Section
- Large gradient card (teal-to-emerald)
- Circular portrait of quoted woman (96x96)
- Quote text in italic, author name + emoji + role
- Animated with AnimatePresence on rotation

## Quote Rotation Logic
- Changes every **10 seconds**
- Every **3rd rotation** shows Bengali quotes
- Uses separate index counters for general vs Bengali pools
- Smooth fade transition via AnimatePresence

## Data Source
Uses [[Data/useTasks Hook]] for task data.

## Related
- [[Components/SwimmingFish]]
- [[Quotes/Quote System]]
- [[Pages/Tasks Page]]
