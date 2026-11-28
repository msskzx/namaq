export const QURAN_TOOLS = ['branches', 'compare', 'prophets', 'tuhfa', 'words', 'word', 'oaths', 'lataif', 'terms', 'term', 'openings', 'order', 'qiraat'] as const;

const ROOT_OF: Record<string, string> = { '(home)': 'index', '(library)': 'books', '(quran)': 'quran', '(hadith)': 'hadith', '(tarajim)': 'tarajim' };

export function openPage(segments: readonly string[]): { tab: string; page: string } {
  if (segments[0] !== '(tabs)') return { tab: '', page: segments.join('/') };
  const tab = segments[1] ?? '(home)';
  return { tab, page: segments[2] ?? ROOT_OF[tab] ?? tab };
}

export const tapOnOpen = (page: string): 'back' | 'retap' => (page === 'search' || page === 'utilities' || page === 'dhikr' || page === 'library' || page === 'book' || page === 'hadith-unit' || page === 'hadith-forty' || page.startsWith('hadith-') || page === 'person' || page === 'nasab' || page === 'ties' || page === 'between' || page === 'people' ? 'back' : 'retap');
