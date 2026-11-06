// ============================================================
//  Personal Dashboard — app.js
// ============================================================

// ── Helpers ──────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, '0');

// ── Storage helpers ───────────────────────────────────────────
const storage = {
  get:    key          => JSON.parse(localStorage.getItem(key) ?? 'null'),
  set:    (key, val)   => localStorage.setItem(key, JSON.stringify(val)),
};

// ============================================================
//  1. GREETING — time, date, and message
// ============================================================
function updateGreeting() {
  const now  = new Date();
  const h    = now.getHours();
  const m    = now.getMinutes();
  const s    = now.getSeconds();

  // Clock
  const ampm  = h >= 12 ? 'PM' : 'AM';
  const hour  = h % 12 || 12;
  $('current-time').textContent = `${pad(hour)}:${pad(m)}:${pad(s)} ${ampm}`;

  // Date
  const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June',
                  'July','August','September','October','November','December'];
  $('current-date').textContent =
    `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  // Greeting
  let greet;
  if      (h < 5)  greet = 'Good night';
  else if (h < 12) greet = 'Good morning';
  else if (h < 17) greet = 'Good afternoon';
  else if (h < 21) greet = 'Good evening';
  else             greet = 'Good night';
  $('greeting-text').innerHTML = `<span>${greet}</span> — have a great day!`;
}

updateGreeting();
setInterval(updateGreeting, 1000);


// ============================================================
//  2. FOCUS TIMER — 25-minute Pomodoro
// ============================================================
const TIMER_TOTAL = 25 * 60;          // seconds
const CIRCUMFERENCE = 440;            // stroke-dasharray on the SVG ring

let timerRemaining = TIMER_TOTAL;
let timerInterval  = null;
let timerRunning   = false;

const ringProgress = document.querySelector('.ring-progress');

function timerRender() {
  const mins = Math.floor(timerRemaining / 60);
  const secs = timerRemaining % 60;
  const display = `${pad(mins)}:${pad(secs)}`;

  // Update ring text
  document.querySelector('.ring-text').textContent = display;

  // Update ring progress
  const pct    = timerRemaining / TIMER_TOTAL;
  const offset = CIRCUMFERENCE * (1 - pct);
  ringProgress.style.strokeDashoffset = offset;

  // Color shifts as time runs out
  if (timerRemaining <= 60) {
    ringProgress.style.stroke = '#e05c5c';
  } else if (timerRemaining <= 5 * 60) {
    ringProgress.style.stroke = '#f5a623';
  } else {
    ringProgress.style.stroke = 'var(--accent)';
  }

  // Button states
  $('btn-start').disabled  = timerRunning;
  $('btn-stop').disabled   = !timerRunning;
}

function timerTick() {
  if (timerRemaining <= 0) {
    timerStop();
    timerAlert();
    return;
  }
  timerRemaining--;
  timerRender();
}

function timerStart() {
  if (timerRunning) return;
  timerRunning = true;
  timerInterval = setInterval(timerTick, 1000);
  timerRender();
}

function timerStop() {
  timerRunning = false;
  clearInterval(timerInterval);
  timerInterval = null;
  timerRender();
}

function timerReset() {
  timerStop();
  timerRemaining = TIMER_TOTAL;
  timerRender();
}

function timerAlert() {
  // Simple browser alert — works without audio permissions
  const msg = "⏰ Focus session complete! Take a 5-minute break.";
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Focus Timer', { body: msg });
  } else {
    alert(msg);
  }
}

$('btn-start').addEventListener('click', timerStart);
$('btn-stop').addEventListener('click', timerStop);
$('btn-reset').addEventListener('click', timerReset);

timerRender();


// ============================================================
//  3. TO-DO LIST
// ============================================================
let todos = storage.get('todos') || [];

function saveTodos() {
  storage.set('todos', todos);
}

function renderTodos() {
  const list = $('todo-list');
  list.innerHTML = '';

  if (todos.length === 0) {
    list.innerHTML = '<p class="todo-empty">No tasks yet — add one above!</p>';
    return;
  }

  todos.forEach((todo, idx) => {
    const li = document.createElement('li');
    li.className = `todo-item${todo.done ? ' done' : ''}`;
    li.dataset.idx = idx;

    li.innerHTML = `
      <span class="task-text">${escapeHtml(todo.text)}</span>
      <div class="todo-actions">
        <button class="btn-icon done-btn"   title="${todo.done ? 'Mark undone' : 'Mark done'}">
          ${todo.done ? '↩' : '✓'}
        </button>
        <button class="btn-icon edit-btn"   title="Edit">✎</button>
        <button class="btn-icon delete-btn" title="Delete">✕</button>
      </div>
    `;

    // Done toggle
    li.querySelector('.done-btn').addEventListener('click', () => {
      todos[idx].done = !todos[idx].done;
      saveTodos();
      renderTodos();
    });

    // Edit
    li.querySelector('.edit-btn').addEventListener('click', () => {
      const span  = li.querySelector('.task-text');
      const input = document.createElement('input');
      input.className = 'task-edit-input';
      input.value     = todos[idx].text;
      li.replaceChild(input, span);
      input.focus();

      const commit = () => {
        const val = input.value.trim();
        if (val) todos[idx].text = val;
        saveTodos();
        renderTodos();
      };
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter')  commit();
        if (e.key === 'Escape') renderTodos();
      });
      input.addEventListener('blur', commit);
    });

    // Delete
    li.querySelector('.delete-btn').addEventListener('click', () => {
      todos.splice(idx, 1);
      saveTodos();
      renderTodos();
    });

    list.appendChild(li);
  });
}

function addTodo() {
  const input = $('todo-input');
  const text  = input.value.trim();
  if (!text) return;
  todos.unshift({ text, done: false });
  saveTodos();
  renderTodos();
  input.value = '';
  input.focus();
}

$('todo-add-btn').addEventListener('click', addTodo);
$('todo-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTodo();
});

renderTodos();


// ============================================================
//  4. QUICK LINKS
// ============================================================
let links = storage.get('quickLinks') || [];

function saveLinks() {
  storage.set('quickLinks', links);
}

function getFavicon(url) {
  try {
    const origin = new URL(url).origin;
    return `https://www.google.com/s2/favicons?domain=${origin}&sz=32`;
  } catch {
    return null;
  }
}

function normalizeUrl(url) {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : 'https://' + url;
}

function renderLinks() {
  const grid = $('links-grid');
  grid.innerHTML = '';

  if (links.length === 0) {
    grid.innerHTML = '<p class="links-empty">No links yet — add one above!</p>';
    return;
  }

  links.forEach((link, idx) => {
    const chip  = document.createElement('a');
    chip.className   = 'link-chip';
    chip.href        = link.url;
    chip.target      = '_blank';
    chip.rel         = 'noopener noreferrer';

    const favicon = getFavicon(link.url);
    chip.innerHTML = `
      ${favicon ? `<img src="${favicon}" alt="" onerror="this.style.display='none'">` : ''}
      <span>${escapeHtml(link.label)}</span>
      <button class="remove-link" title="Remove" data-idx="${idx}">×</button>
    `;

    chip.querySelector('.remove-link').addEventListener('click', e => {
      e.preventDefault();
      links.splice(idx, 1);
      saveLinks();
      renderLinks();
    });

    grid.appendChild(chip);
  });
}

function addLink() {
  const labelInput = $('link-label');
  const urlInput   = $('link-url');
  const label = labelInput.value.trim();
  const url   = normalizeUrl(urlInput.value.trim());

  if (!label || !url) return;

  links.push({ label, url });
  saveLinks();
  renderLinks();
  labelInput.value = '';
  urlInput.value   = '';
  labelInput.focus();
}

$('link-add-btn').addEventListener('click', addLink);
$('link-url').addEventListener('keydown', e => {
  if (e.key === 'Enter') addLink();
});
$('link-label').addEventListener('keydown', e => {
  if (e.key === 'Enter') addLink();
});

renderLinks();


// ============================================================
//  Utility — escape HTML to prevent XSS
// ============================================================
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
