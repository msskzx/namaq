import { pageGroups, type MushafPage, type WordGroup } from '@shared/quran/readerPage';
import { isHidden, nextAyah, revealAyah, revealWord, type RecitePosition } from '@shared/quran/recite';

/** One mushaf page as the reader needs it while reading and reciting (the website's ReaderView, for one page). */
export type PageModel = {
  lines: (WordGroup[] | null)[];
  /** Ayat on the page, in order. */
  order: string[];
  /** Words of each ayah on the page. */
  words: Record<string, number>;
  /** Surahs whose title is on the page: 2 steps when a basmala follows the title, else 1. */
  titles: Map<number, number>;
};

export function pageModel(data: MushafPage, top?: number): PageModel {
  const lines = pageGroups(data.items, top);
  const order: string[] = [];
  const words: Record<string, number> = {};
  lines.forEach(line => line?.forEach(group => {
    const key = `${group.surah}:${group.ayah}`;
    if (!order.includes(key)) order.push(key);
    if (group.word) words[key] = (words[key] ?? 0) + 1;
  }));
  const titles = new Map<number, number>();
  data.items.forEach((item, at) => {
    if ('surah' in item) titles.set(item.surah, data.items[at + 1] && 'basmala' in data.items[at + 1] ? 2 : 1);
  });
  return { lines, order, words, titles };
}

/** Recite mode on one page: what is hidden and what the next step shows. */
export function reciteView(model: PageModel, position: RecitePosition) {
  // A surah's title and then its basmala are steps of their own before its first ayah, unless recitation starts there.
  const titled: ReadonlyMap<number, number> = new Map([...model.titles].filter(([surah]) => `${surah}:1` !== position.start));
  const counts = { ...model.words };
  titled.forEach((steps, surah) => { counts[`${surah}:1`] = (counts[`${surah}:1`] ?? 0) + steps; });
  const upcoming = nextAyah(position, model.order);
  const titleSteps = upcoming?.endsWith(':1') ? titled.get(Number(upcoming.split(':')[0])) ?? 0 : 0;
  return {
    titled,
    upcoming,
    /** `word` counts the ayah's words on the page from 0, after its title steps. */
    hidden: (key: string, word: number) => isHidden(position, key, word, upcoming),
    /** The next ayah step: a title or basmala, else the whole ayah; null when the page is done. */
    nextAyah: (): RecitePosition | null => {
      if (!upcoming) return null;
      return position.words < titleSteps ? { ...position, words: position.words + 1 } : revealAyah(position, upcoming);
    },
    nextWord: (): RecitePosition | null => (upcoming ? revealWord(position, upcoming, counts[upcoming] ?? 0) : null),
  };
}
