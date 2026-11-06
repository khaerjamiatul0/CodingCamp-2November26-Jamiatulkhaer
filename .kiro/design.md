# Design — Personal Dashboard

## Visual Theme

| Property | Value |
|----------|-------|
| Background | Very dark navy `#0f1117` |
| Card surface | Dark `#1a1d27` |
| Accent color | Purple `#6c63ff` |
| Text | Off-white `#e8eaf6` |
| Muted text | Gray-blue `#8890a4` |
| Success color | Green `#4caf7d` |
| Danger color | Red `#e05c5c` |
| Font | Segoe UI / system-ui |

---

## Page Layout

```
┌─────────────────────────────────────────────┐
│               GREETING CARD                 │
│         Good morning — have a great day!    │
│                  10:24:05 AM                │
│           Friday, November 6, 2026          │
└─────────────────────────────────────────────┘

┌───────────────────┐  ┌──────────────────────┐
│   FOCUS TIMER     │  │    QUICK LINKS        │
│                   │  │                       │
│    ┌────────┐     │  │  [Label] [URL] [+Add] │
│    │ 25:00  │     │  │                       │
│    └────────┘     │  │  ⬤ YouTube  ×         │
│                   │  │  ⬤ GitHub   ×         │
│ [Start][Stop][↺]  │  │  ⬤ Google   ×         │
└───────────────────┘  └──────────────────────┘

┌─────────────────────────────────────────────┐
│                TO-DO LIST                   │
│  [ Type a task here...          ] [+ Add]   │
│                                             │
│  ✓  Buy groceries                  ✓ ✎ ✕   │
│  ~~Finish report~~                 ✓ ✎ ✕   │
│  Study JavaScript                  ✓ ✎ ✕   │
└─────────────────────────────────────────────┘
```

---

## Component Details

### Greeting Card
- Full-width card at the top
- Dark gradient background (navy to deep purple)
- Greeting text in accent color, centered
- Large bold time display
- Smaller muted date below

### Focus Timer
- Centered SVG circular progress ring (radius 70px)
- Ring shrinks clockwise as time runs out
- Time shown inside the ring
- Three buttons below: Start (purple), Stop (gray), Reset (gray)
- Stop button is disabled when timer is not running
- Start button is disabled when timer is running

### Quick Links
- Two input fields side by side: Label + URL
- Purple "+ Add" button
- Links appear as rounded pill-shaped chips
- Each chip has: favicon icon + label text + × remove button
- Chips wrap to new lines if there are many

### To-Do List
- Full-width card at the bottom
- Single text input + "+ Add" button
- Each task row has:
  - Task text (struck through if done)
  - ✓ toggle button (green on hover)
  - ✎ edit button (purple on hover)
  - ✕ delete button (red on hover)
- Empty state message when no tasks exist
- Scrollable list if tasks overflow

---

## File Structure

```
project/
├── index.html          ← page structure
├── css/
│   └── style.css       ← all styles (1 file only)
└── js/
    └── app.js          ← all logic (1 file only)
```

---

## Responsive Behavior

| Screen size | Layout |
|-------------|--------|
| Above 640px | Timer and Quick Links side by side (2 columns) |
| Below 640px | All sections stack vertically (1 column) |

---

## Accessibility

- All buttons have `title` attributes for tooltips
- Input fields have placeholder text
- Color is not the only indicator (text labels used alongside color)
- Focus states visible via browser defaults
