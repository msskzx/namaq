/**
 * The one-time tip a page shows the first time it opens (owner, 2026-11-13): one line naming the touch the page hides.
 * Minimal text, no counts. The app (mobile/src/components/TabHint.tsx) and the website (src/components/common/PageHint.tsx)
 * keep the pages already shown under HINTS_SEEN; replaying the tour clears it.
 */
export type HintId = 'read' | 'branches' | 'compare' | 'prophets' | 'utilities';

export const HINT_IDS: HintId[] = ['read', 'branches', 'compare', 'prophets', 'utilities'];

export const HINTS_SEEN = 'hints-seen';

export const HINTS: Record<HintId, { ar: string; en: string }> = {
  read: { ar: 'اضغط آية لتظلّلها، وأطل الضغط لتظهر أزرارها، واضغطها مرتين لحفظها.', en: 'Tap an ayah to highlight it, hold it for its buttons, and double-tap to save it.' },
  branches: { ar: 'اضغط فرعًا ليضيء طريقه وتظهر آيته، واضغط الشجرة مرتين لحفظها.', en: 'Tap a branch to light its path and show its ayah; double-tap the tree to save it.' },
  compare: { ar: 'اضغط كلمة ملوّنة لتضيء نظيرتها.', en: 'Tap a coloured word to light its match.' },
  prophets: { ar: 'اضغط دائرة لتقرأ آياتها في السورة.', en: 'Tap a dot to read its ayat in that surah.' },
  utilities: { ar: 'بدّل من الأعلى بين المواقيت والقبلة والتقويم.', en: 'Switch between prayer times, qibla and calendar at the top.' },
};

/** The page's tip on the website, by its path; none elsewhere. */
export function hintOfPath(path: string): HintId | null {
  if (path === '/quran/read' || path.startsWith('/quran/read/')) return 'read';
  if (path === '/quran/branches' || path.startsWith('/quran/branches/')) return 'branches';
  if (path === '/quran/compare' || path.startsWith('/quran/compare/')) return 'compare';
  if (path.startsWith('/quran/prophets/')) return 'prophets';
  if (path === '/utilities') return 'utilities';
  return null;
}

/** The stored list, read leniently: anything unreadable counts as nothing seen. */
export function parseHintsSeen(raw: string | null): HintId[] {
  try {
    const value: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(value) ? value.filter((item): item is HintId => HINT_IDS.includes(item as HintId)) : [];
  } catch { return []; }
}
