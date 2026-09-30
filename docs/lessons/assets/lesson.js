/* Shared chrome for every page in docs/lessons: Tailwind config, theme, the
   collapsible index, and quiz feedback. Loaded in <head> after the Tailwind
   CDN so the theme class lands before first paint. */

tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Iowan Old Style', 'Palatino Linotype', 'Palatino', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
};

const PAGES = [
  { group: 'Lessons', href: '../lessons/0001-where-text-becomes-citable.html', label: '0001 · Where text becomes citable' },
  { group: 'Lessons', href: '../lessons/0002-who-owns-a-page.html', label: '0002 · Who owns a page' },
  { group: 'Lessons', href: '../lessons/0003-a-check-that-exists-but-doesnt-run.html', label: "0003 · A check that exists but doesn't run" },
  { group: 'Reference', href: '../reference/source-pipeline.html', label: 'Source pipeline card' },
  { group: 'Workspace', href: '../MISSION.md', label: 'Mission' },
  { group: 'Workspace', href: '../RESOURCES.md', label: 'Resources' },
  { group: 'Workspace', href: '../NOTES.md', label: 'Notes' },
];

// Storage throws outright where site data is blocked, and an uncaught throw
// here would take the index and the theme switch down with it.
function remembered(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function remember(key, value) {
  try { localStorage.setItem(key, value); } catch { /* not remembered, still works */ }
}

const stored = remembered('lessonTheme');
const dark = stored ? stored === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.classList.toggle('dark', dark);

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildIndex() {
  const here = location.pathname.split('/').pop();
  const groups = new Map();
  for (const page of PAGES) {
    if (!groups.has(page.group)) groups.set(page.group, []);
    groups.get(page.group).push(page);
  }

  const link = 'block rounded px-2 py-1 text-sm text-stone-600 hover:bg-amber-100 hover:text-amber-900 dark:text-stone-400 dark:hover:bg-amber-950 dark:hover:text-amber-200';
  const heading = 'mt-4 mb-1 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-amber-700 dark:text-amber-500';
  let html = '';

  for (const [group, pages] of groups) {
    html += `<p class="${heading}">${group}</p>`;
    for (const page of pages) {
      const current = page.href.endsWith(here);
      html += `<a href="${page.href}" class="${link} ${current ? 'bg-amber-100 font-semibold text-amber-900 dark:bg-amber-950 dark:text-amber-200' : ''}">${page.label}</a>`;
    }
  }

  const sections = [...document.querySelectorAll('main h2')];
  if (sections.length) {
    html += `<p class="${heading}">On this page</p>`;
    for (const section of sections) {
      section.id ||= slug(section.textContent);
      html += `<a href="#${section.id}" class="${link}">${section.textContent}</a>`;
    }
  }
  return html;
}

addEventListener('DOMContentLoaded', () => {
  const index = document.getElementById('index');
  const toggle = document.getElementById('index-toggle');
  const theme = document.getElementById('theme-toggle');

  index.innerHTML = buildIndex();

  const setOpen = (open) => {
    index.classList.toggle('hidden', !open);
    toggle.setAttribute('aria-expanded', String(open));
    remember('lessonIndex', open ? 'open' : 'closed');
  };
  // Below lg the index would cover the centered text, so it starts closed there.
  const remembered_index = remembered('lessonIndex');
  setOpen(remembered_index ? remembered_index === 'open' : innerWidth >= 1024);
  toggle.addEventListener('click', () => setOpen(index.classList.contains('hidden')));

  const paintTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    theme.textContent = isDark ? '☀' : '☾';
    theme.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  };
  paintTheme();
  theme.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    remember('lessonTheme', isDark ? 'dark' : 'light');
    paintTheme();
  });

  document.querySelectorAll('[data-quiz]').forEach((quiz) => {
    const answer = Number(quiz.dataset.quiz);
    const options = [...quiz.querySelectorAll('button')];
    const feedback = quiz.querySelector('[data-feedback]');
    options.forEach((option, i) => {
      option.addEventListener('click', () => {
        const correct = i + 1 === answer;
        option.dataset.state = correct ? 'right' : 'wrong';
        options[answer - 1].dataset.state = 'right';
        options.forEach((each) => { each.disabled = true; });
        feedback.hidden = false;
        feedback.textContent = correct ? feedback.dataset.right : feedback.dataset.wrong;
      });
    });
  });
});
