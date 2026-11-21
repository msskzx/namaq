import { pageGroups, type MushafPage, type WordGroup } from './readerPage';
import { isHidden, nextAyah, revealAyah, revealWord, type RecitePosition } from './recite';

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
  // The forgotten words under review, as places among the ayah's words on the page (the ۞ mark counted there, not in a gap).
  const tokens = position.gaps ? model.lines.flatMap(line => line?.filter(group => group.word && `${group.surah}:${group.ayah}` === position.start).map(group => group.word) ?? []) : [];
  const places = tokens.map((word, at) => (word === '۞' ? -1 : at)).filter(at => at >= 0);
  const marked = (position.gaps ?? []).filter(gap => places[gap] !== undefined).map(place => ({ place, at: places[place] }));
  const gaps = marked.map(gap => gap.at);
  const reviewing = !!position.gaps && position.shown !== position.start && upcoming === position.start;
  /** The forgotten word the next step shows, once the ayah is shown up to it: its place on the page (`at`) and in the ayah. */
  const gap = (reviewing && marked.find(gap => gap.at === position.words)) || null;
  return {
    titled,
    upcoming,
    gap,
    /** `word` counts the ayah's words on the page from 0, after its title steps. */
    hidden: (key: string, word: number) => isHidden(position, key, word, upcoming),
    /**
     * The next ayah step: a title or basmala, else the whole ayah; null when the page is done. With forgotten words under
     * review, the ayah up to the next forgotten word, then that word, and so on to its end (owner, 2026-11-21).
     */
    nextAyah: (): RecitePosition | null => {
      if (!upcoming) return null;
      if (reviewing && gaps.length) {
        const length = counts[upcoming] ?? 0;
        if (gap) return revealWord(position, upcoming, length);
        const next = gaps.find(at => at > position.words);
        return next !== undefined && next < length ? { ...position, words: next } : revealAyah(position, upcoming);
      }
      return position.words < titleSteps ? { ...position, words: position.words + 1 } : revealAyah(position, upcoming);
    },
    nextWord: (): RecitePosition | null => (upcoming ? revealWord(position, upcoming, counts[upcoming] ?? 0) : null),
  };
}

/** Shown pages as one (the website's two-page spread): an ayah's words are counted across them, in order. */
export function joinModels(models: PageModel[]): PageModel {
  if (models.length === 1) return models[0];
  const words: Record<string, number> = {};
  const titles = new Map<number, number>();
  models.forEach(model => {
    Object.entries(model.words).forEach(([key, count]) => { words[key] = (words[key] ?? 0) + count; });
    model.titles.forEach((steps, surah) => titles.set(surah, steps));
  });
  return { lines: models.flatMap(model => model.lines), order: [...new Set(models.flatMap(model => model.order))], words, titles };
}
