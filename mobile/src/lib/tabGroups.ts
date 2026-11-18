/**
 * The tab bar's five buttons, right to left: Quran, hadith, home, tarajim, quizzes (owner, 2026-11-18). The mushaf opens
 * from the Quran hub and from home's cards; the library and the utilities open from the buttons at the top of home.
 * The home, hadith, tarajim and Quran buttons each hold a page stack ((home), (hadith), (tarajim) and (quran) in app/(tabs)),
 * and so does the library, opened from home: home with the search and the utilities over it, the hadith list with a hadith over it, the shelf with a book over it, the Quran hub with the tools it opens over it. A swipe from the right edge goes back down the stack (lib/stackOptions.ts),
 * and a tap on the button from another tab comes back to the page that was open there last.
 */
/** The Quran hub's tools. A new tool is a page in app/(tabs)/(quran), a name here and a tile on the hub. */
export const QURAN_TOOLS = ['branches', 'compare', 'prophets', 'tuhfa', 'words', 'oaths', 'lataif', 'terms', 'term', 'openings', 'order'] as const;

/** The first page of each stacked button. */
const ROOT_OF: Record<string, string> = { '(home)': 'index', '(library)': 'books', '(quran)': 'quran', '(hadith)': 'hadith', '(tarajim)': 'tarajim' };

/** The open tab and its page, from the route's segments (useSegments): ['(tabs)', '(quran)', 'branches'] is branches under the Quran button. */
export function openPage(segments: readonly string[]): { tab: string; page: string } {
  if (segments[0] !== '(tabs)') return { tab: '', page: segments.join('/') };
  const tab = segments[1] ?? '(home)';
  return { tab, page: segments[2] ?? ROOT_OF[tab] ?? tab };
}

/**
 * What a tap on the open button does: from the search or the utilities it goes back home, from a book back to the
 * shelf, from a hadith back to the list, and from a person or a nasab tree back to the tarajim list (a way back, not a re-tap);
 * any other page goes to its top, then resets (lib/tabRetap.ts).
 */
export const tapOnOpen = (page: string): 'back' | 'retap' => (page === 'search' || page === 'utilities' || page === 'book' || page === 'hadith-unit' || page === 'hadith-forty' || page === 'person' || page === 'nasab' ? 'back' : 'retap');
