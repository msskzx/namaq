// The «الرحمن» scene's hadith words (shared/quran/scenes/rahman.ts), read from the one Sahih text (data/hadith/sahih) and
// written by buildRahmanScene.ts to shared/data/quran/rahmanHadith.json, which the phone ships. rahmanScene.test.ts fails
// when that file lags the text or the scene.
import { readFileSync } from 'node:fs';
import { findHadith, type SahihText } from '@shared/sahih';
import { FATIHA_HADITH, FATIHA_PART, MERCY_HADITH, SCENE_HADITH, isName, type BuiltHadith, type SahihBookSlug, type SceneHadith } from '@shared/quran/scenes/rahman';

export const OUT = 'shared/data/quran/rahmanHadith.json';

/** About how many letters a part of a long hadith keeps around the name: what a 4:5 page holds under its title. */
const PART = 480;

const books = new Map<SahihBookSlug, SahihText>();
export const sahihBook = (name: SahihBookSlug) => {
  if (!books.has(name)) books.set(name, JSON.parse(readFileSync(`data/hadith/sahih/${name}.json`, 'utf8')) as SahihText);
  return books.get(name)!;
};

/** A hadith's words as the scene shows them, with their place in its whole text (its routes joined by one space). */
export function builtHadith(hadith: SceneHadith): BuiltHadith {
  const found = findHadith(sahihBook(hadith.book), hadith.n);
  if (!found) throw new Error(`no ${hadith.book} ${hadith.n} in data/hadith/sahih`);
  const routes = found.hadith.routes;
  const at = hadith.route ? routes.findIndex(route => route.route === hadith.route) : 0;
  if (at < 0) throw new Error(`${hadith.book} ${hadith.n} has no route ${hadith.route}`);
  const offset = routes.slice(0, at).reduce((sum, route) => sum + route.text.length + 1, 0);
  const text = routes[at].text;
  let start = routes[at].isnadEnd ?? 0;
  let end = text.length;
  if (hadith.from) {
    const i = text.indexOf(hadith.from, start);
    if (i < 0) throw new Error(`${hadith.id}: «${hadith.from}» is not in its words`);
    start = i + hadith.from.length;
  }
  if (hadith.until) {
    const i = text.indexOf(hadith.until, start);
    if (i < 0) throw new Error(`${hadith.id}: «${hadith.until}» is not in its words`);
    end = i;
  }
  while (text[start] === ' ') start++;
  while (text[end - 1] === ' ') end--;
  let cutBefore = !!hadith.part;
  let cutAfter = !!hadith.part;
  if (hadith.cut) [start, end, cutBefore, cutAfter] = partAround(text, start, end);
  return { book: hadith.book, n: hadith.n, from: offset + start, to: offset + end, text: text.slice(start, end), cutBefore, cutAfter };
}

/** Whole words around the first naming of «الرحمن» between `start` and `end`, about PART letters, a third of them before it. */
function partAround(text: string, start: number, end: number): [number, number, boolean, boolean] {
  const spaces = [start - 1];
  for (let i = start; i < end; i++) if (text[i] === ' ') spaces.push(i);
  spaces.push(end);
  const words = spaces.slice(0, -1).map((space, i) => [space + 1, spaces[i + 1]] as const);
  const name = words.findIndex(([s, e], i) => isName(text.slice(s, e), i ? text.slice(...words[i - 1]) : ''));
  if (name < 0) throw new Error('a part is cut around the name, and the words hold none');
  let first = name;
  let last = name;
  while (first > 0 && words[name][0] - words[first - 1][0] < PART / 3) first--;
  while (last < words.length - 1 && words[last + 1][1] - words[first][0] < PART) last++;
  return [words[first][0], words[last][1], first > 0, last < words.length - 1];
}

/** Every hadith the scene shows, by its id. */
export const buildRahmanHadith = (): Record<string, BuiltHadith> =>
  Object.fromEntries([FATIHA_HADITH, FATIHA_PART, ...SCENE_HADITH, MERCY_HADITH].map(hadith => [hadith.id, builtHadith(hadith)]));
