# Tasks Page

**Route:** `/tasks`
**File:** `src/app/tasks/page.tsx` (1,421 lines)
**Directive:** `"use client"`

## Purpose
Full-featured task management page matching the Consolidated Action Tracker.

## Auth Guard
Same as [[Dashboard Page]] - checks localStorage, redirects if needed.

## Layout
- Same sidebar as dashboard (Dashboard/Tasks nav, logout)
- Responsive: hamburger menu on mobile with slide-in drawer

## Top Section
- Page title "Action Tracker"
- Green "Add Task" button
- Quick stats bar (total/done/in-progress/due with colored dots)

## Search & Filters
- **Full-text search** - filters by action text or owner name
- **Collapsible filter panel** with:
  - Owner dropdown (All, Reema, Jacek, etc.)
  - Status filter pills (all 7 statuses)
- **Active filter count badge**
- **Sort controls:** Due Date (default), Owner, Status - with toggle direction

## Task Table
- Green header row (#4a7c59)
- Columns: Owner, Action, Deadline, Status, Actions
- Alternating row backgrounds
- Owner shown as colored avatar circle (first letter)
- Status as colored badge with emoji
- Action buttons appear on hover (cycle status, edit, delete)
- Keyboard accessible (tabIndex, role="row", aria-expanded)

## Expandable Subtasks
- Click row to expand/collapse (framer-motion height animation)
- Gradient progress bar with "X/Y hours completed"
- Each subtask: checkbox, title, hours required
- Spring animation on checkbox completion
- Line-through on completed subtasks

## Inline Add Subtask
- "Add subtask" link below subtask list
- Title + hours inputs, Enter to submit, Escape to cancel

## Add/Edit Task Modal
- **Owner:** Dropdown (Reema, Jacek, J+R+Gosia, Team, Other...)
  - "Other..." shows custom text input
- **Action:** Textarea
- **Deadline:** Label text + date picker
- **Status:** Dropdown (all 7 statuses)
- **Subtasks:** Add/remove with title + hours
- Spring-animated entrance/exit, click-outside-to-dismiss

## Delete Confirmation Modal
- Shows task action text in quotes
- Warning icon, Cancel/Delete buttons

## Data Persistence
Uses [[Data/useTasks Hook]] - every mutation persists immediately.

## Sorting Logic
- Default: due date ascending (earliest first)
- Null dates pushed to bottom
- Toggle direction per sort field

## Related
- [[Data/useTasks Hook]]
- [[Data/Types]]
- [[Components/SwimmingFish]]
