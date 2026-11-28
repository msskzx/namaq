import { HIZB } from './quranText/ayahWords';
import { pageGroups, type MushafPage, type WordGroup } from './readerPage';
import { isHidden, nextAyah, revealAyah, type RecitePosition } from './recite';

export type PageModel = {
  lines: (WordGroup[] | null)[];
  order: string[];
  words: Record<string, number>;
  signs: Record<string, number[]>;
  titles: Map<number, number>;
};

const isSign = (word: string) => word === HIZB;

export function pageModel(data: MushafPage, top?: number): PageModel {
  const lines = pageGroups(data.items, top);
  const order: string[] = [];
  const words: Record<string, number> = {};
  const signs: Record<string, number[]> = {};
  lines.forEach(line => line?.forEach(group => {
    const key = `${group.surah}:${group.ayah}`;
    if (!order.includes(key)) order.push(key);
    if (!group.word) return;
    if (isSign(group.word)) (signs[key] ??= []).push(words[key] ?? 0);
    words[key] = (words[key] ?? 0) + 1;
  }));
  const titles = new Map<number, number>();
  data.items.forEach((item, at) => {
    if ('surah' in item) titles.set(item.surah, data.items[at + 1] && 'basmala' in data.items[at + 1] ? 2 : 1);
  });
  return { lines, order, words, signs, titles };
}

export function reciteView(model: PageModel, position: RecitePosition) {
  const titled: ReadonlyMap<number, number> = new Map([...model.titles].filter(([surah]) => `${surah}:1` !== position.start));
  const counts = { ...model.words };
  titled.forEach((steps, surah) => { counts[`${surah}:1`] = (counts[`${surah}:1`] ?? 0) + steps; });
  const upcoming = nextAyah(position, model.order);
  const titleSteps = upcoming?.endsWith(':1') ? titled.get(Number(upcoming.split(':')[0])) ?? 0 : 0;
  const wordsOf = (key: string) => {
    const signs = new Set(model.signs[key] ?? []);
    return Array.from({ length: model.words[key] ?? 0 }, (_, at) => at).filter(at => !signs.has(at));
  };
  const stops = (key: string) => {
    const lead = key.endsWith(':1') ? titled.get(Number(key.split(':')[0])) ?? 0 : 0;
    return [...Array.from({ length: lead }, (_, at) => at + 1), ...wordsOf(key).map(at => lead + at + 1)];
  };
  const reveal = (key: string): RecitePosition => {
    const next = stops(key).find(stop => stop > position.words);
    return next === undefined || next >= (counts[key] ?? 0) ? revealAyah(position, key) : { ...position, words: next };
  };
  const places = position.gaps ? wordsOf(position.start) : [];
  const startStops = position.gaps ? [0, ...stops(position.start)] : [];
  const marked = (position.gaps ?? []).filter(place => places[place] !== undefined)
    .map(place => ({ place, at: places[place], stop: startStops.filter(stop => stop <= places[place]).at(-1)! }));
  const reviewing = !!position.gaps && position.shown !== position.start && upcoming === position.start;
  const found = (reviewing && marked.find(gap => gap.stop === position.words)) || null;
  const gap = found && { place: found.place, at: found.at };
  return {
    titled,
    upcoming,
    gap,
    hidden: (key: string, word: number) => isHidden(position, key, word, upcoming),
    nextAyah: (): RecitePosition | null => {
      if (!upcoming) return null;
      if (reviewing && marked.length) {
        if (gap) return reveal(upcoming);
        const next = marked.find(gap => gap.stop > position.words);
        return next ? { ...position, words: next.stop } : revealAyah(position, upcoming);
      }
      return position.words < titleSteps ? { ...position, words: position.words + 1 } : revealAyah(position, upcoming);
    },
    nextWord: (): RecitePosition | null => (upcoming ? reveal(upcoming) : null),
  };
}

export function joinModels(models: PageModel[]): PageModel {
  if (models.length === 1) return models[0];
  const words: Record<string, number> = {};
  const signs: Record<string, number[]> = {};
  const titles = new Map<number, number>();
  models.forEach(model => {
    Object.entries(model.signs).forEach(([key, at]) => { (signs[key] ??= []).push(...at.map(sign => sign + (words[key] ?? 0))); });
    Object.entries(model.words).forEach(([key, count]) => { words[key] = (words[key] ?? 0) + count; });
    model.titles.forEach((steps, surah) => titles.set(surah, steps));
  });
  return { lines: models.flatMap(model => model.lines), order: [...new Set(models.flatMap(model => model.order))], words, signs, titles };
}
