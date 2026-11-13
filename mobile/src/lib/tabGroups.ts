/**
 * The tab bar's five buttons (owner, 2026-11-13), left to right: utilities, quizzes, home, mushaf, Quran.
 * The Quran button holds several tab pages: its hub and the tools the hub opens. The bar lights the Quran button
 * on any of them, and a tap on it from another tab goes back to the Quran page that was open last.
 */
export const QURAN_HUB = 'quran';
export const QURAN_TOOLS = ['branches', 'compare', 'prophets', 'tuhfa', 'words', 'oaths', 'iltifat'] as const;
const QURAN_PAGES: readonly string[] = [QURAN_HUB, ...QURAN_TOOLS];

/** The bar button a tab page belongs to: the Quran pages share one, every other page has its own. */
/** The search, opened from home, lights the home button. */
export const buttonOf = (route: string) => (QURAN_PAGES.includes(route) ? QURAN_HUB : route === 'search' ? 'index' : route);

let lastQuran = QURAN_HUB;

/** Remembers the Quran page open now, so the Quran button can come back to it. */
export function noteRoute(route: string) {
  if (QURAN_PAGES.includes(route)) lastQuran = route;
}

/** Whether a tap on a bar button is a re-tap: its button is lit and its page is the one open (not the search, which lights home). */
export const isRetap = (current: string, button: string) => buttonOf(current) === button && pageOf(button) === current;

/** The page a tap on a bar button opens. */
export const pageOf = (button: string) => (button === QURAN_HUB ? lastQuran : button);
