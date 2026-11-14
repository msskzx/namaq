/**
 * The tab bar's five buttons (owner, 2026-11-13), left to right: utilities, quizzes, home, mushaf, Quran.
 * The home and Quran buttons each hold a page stack ((home) and (quran) in app/(tabs)): home with the search over it,
 * the Quran hub with the tools it opens over it. A swipe from the right edge goes back down the stack (lib/stackOptions.ts),
 * and a tap on the button from another tab comes back to the page that was open there last.
 */
/** The first page of each stacked button. A new Quran tool is a new page in app/(tabs)/(quran) and a tile on the hub. */
const ROOT_OF: Record<string, string> = { '(home)': 'index', '(quran)': 'quran' };

/** The open tab and its page, from the route's segments (useSegments): ['(tabs)', '(quran)', 'branches'] is branches under the Quran button. */
export function openPage(segments: readonly string[]): { tab: string; page: string } {
  if (segments[0] !== '(tabs)') return { tab: '', page: segments.join('/') };
  const tab = segments[1] ?? '(home)';
  return { tab, page: segments[2] ?? ROOT_OF[tab] ?? tab };
}

/**
 * What a tap on the open button does: from the search it goes back home (a way home, not a re-tap);
 * any other page goes to its top, then resets (lib/tabRetap.ts).
 */
export const tapOnOpen = (page: string): 'back' | 'retap' => (page === 'search' ? 'back' : 'retap');
