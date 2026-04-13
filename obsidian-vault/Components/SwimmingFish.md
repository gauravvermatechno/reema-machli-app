# SwimmingFish Component

**File:** `src/components/SwimmingFish.tsx` (181 lines)
**Directive:** `"use client"`

## Purpose
An interactive fish mascot ("machli") that swims around the page. Adds personality and delight.

## Behavior
- **Swims randomly** across the screen every 4-7 seconds
- **Direction-aware** - faces left or right based on movement
- Fixed position, pointer-events-none container (fish itself is clickable)
- z-index: 50 (above content)

## Click Interactions
| Click # | Effect |
|---------|--------|
| Any click | Fish does a 360-degree flip + scale up |
| Any click | 5 bubbles float upward and fade |
| Every 3rd | 3 heart emojis float up instead |
| Every 3rd | Fish changes color (teal -> pink) |
| Every 5th | Fish changes color (teal -> gold) |

## SVG Fish Design
- Custom SVG (48x36px)
- Body ellipse + triangular tail
- Eye with white highlight
- Top/bottom fins
- Scale shimmer effects (white opacity)
- `drop-shadow-lg` for depth

## Animation Details
- **Swimming:** `type: 'tween', duration: 3, ease: 'easeInOut'`
- **Flip:** `rotateY: 360, duration: 0.6`
- **Bubbles:** `opacity: 1->0, y: upward 60px, duration: 1.5`
- **Hearts:** `opacity: 1->0, y: upward 80px, scale: 0.3->1.2`
- **Ripple:** Infinite pulsing box-shadow ring

## Used In
- [[Pages/Dashboard Page]]
- [[Pages/Tasks Page]]
