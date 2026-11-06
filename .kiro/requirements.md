# Requirements — Personal Dashboard

## What is this app?
A personal dashboard that runs directly in your browser.
No installation, no internet connection, and no login required.
Everything is saved on your own computer.

---

## Features

### 1. Greeting
- Shows the current time, updated every second
- Shows today's full date (e.g. Friday, November 6, 2026)
- Shows a greeting based on the time of day:
  - Before 5 AM → "Good night"
  - 5 AM – 11 AM → "Good morning"
  - 12 PM – 4 PM → "Good afternoon"
  - 5 PM – 8 PM → "Good evening"
  - After 9 PM → "Good night"

---

### 2. Focus Timer
- Counts down from 25 minutes (the Pomodoro technique)
- Has three buttons:
  - **Start** — begins the countdown
  - **Stop** — pauses the countdown
  - **Reset** — brings it back to 25:00
- A circular ring around the timer shrinks as time passes
- The ring turns **orange** when under 5 minutes remain
- The ring turns **red** when under 1 minute remains
- When the timer reaches zero, an alert notifies the user

---

### 3. To-Do List
- User can **add** a task by typing and pressing Enter or clicking Add
- User can **mark a task as done** — it gets a strikethrough
- User can **edit** a task name inline
- User can **delete** a task
- Tasks are **saved automatically** — they stay even after closing the browser
- Tasks are stored using the browser's localStorage

---

### 4. Quick Links
- User can add a shortcut to any website
- Each link needs a **label** (e.g. "YouTube") and a **URL** (e.g. youtube.com)
- Clicking a link opens the website in a new browser tab
- Each link shows a small favicon icon of the website
- User can remove any link by clicking ×
- Links are **saved automatically** using the browser's localStorage

---

## Rules & Constraints

| Rule | Detail |
|------|--------|
| No frameworks | Built with plain HTML, CSS, and JavaScript only |
| No backend | Runs as a static file — no server needed |
| No database | Data stored in browser localStorage |
| One CSS file | All styles in `css/style.css` |
| One JS file | All logic in `js/app.js` |
| Browser support | Chrome, Firefox, Edge, Safari (modern versions) |

---

## Data Storage

All data is stored locally in the user's browser using the `localStorage` API:

- `todos` — array of task objects `{ text, done }`
- `quickLinks` — array of link objects `{ label, url }`

No data is ever sent to a server or third party.
