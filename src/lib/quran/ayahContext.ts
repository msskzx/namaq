// docs/plans/quran-shared-openings.md
import wordKeys from '@/app/quran/compare/wordKeys.json';
import { readerAyat, spell, type BranchAyah } from './branches';
import { wordTokens } from './compare';
import { normalizeWord } from './normalize';

export type AyahContext = { ayah: BranchAyah; before: BranchAyah | null; after: BranchAyah | null; match?: { exact: number[]; rooted: number[] } };

let source: Promise<BranchAyah[]> | undefined;

export function loadReaderAyat(): Promise<BranchAyah[]> {
  return source ??= Promise.all(Array.from({ length: 604 }, (_, i) => import(`../../app/quran/read/data/${i + 1}.json`)))
    .then(pages => readerAyat(pages.map(page => page.default)))
    .catch(error => { source = undefined; throw error; });
}

export function ayahContexts(all: BranchAyah[], wanted: string[]): AyahContext[] {
  const byKey = new Map(all.map(ayah => [ayah.key, ayah]));
  return [...new Set(wanted)].flatMap(key => {
    const ayah = byKey.get(key);
    if (!ayah) return [];
    const [surah, number] = key.split(':').map(Number);
    return [{ ayah, before: byKey.get(`${surah}:${number - 1}`) ?? null, after: byKey.get(`${surah}:${number + 1}`) ?? null }];
  }).sort((a, b) => {
    const [as, aa] = a.ayah.key.split(':').map(Number);
    const [bs, ba] = b.ayah.key.split(':').map(Number);
    return as - bs || aa - ba;
  });
}

const tokens = (ayah: BranchAyah) => {
  const [surah, number] = ayah.key.split(':').map(Number);
  const norm = ayah.words.map(normalizeWord);
  return { norm, keys: wordTokens(norm, wordKeys.surahs[surah - 1]?.[number - 1]) };
};

export function sharedByAll(contexts: AyahContext[]): AyahContext[] {
  if (contexts.length < 2) return contexts;
  const all = contexts.map(context => {
    const { keys } = tokens(context.ayah);
    const forms = context.ayah.words.map(spell);
    const byKey = new Map<string, number[]>();
    keys.forEach((key, i) => byKey.set(key, [...(byKey.get(key) ?? []), i]));
    return { forms, byKey };
  });
  const shared = [...all[0].byKey.keys()].flatMap(key => {
    const lists = all.map(ayah => ayah.byKey.get(key) ?? []);
    const count = Math.min(...lists.map(list => list.length));
    return count === 0 ? [] : [{ key, count, common: lists.map((list, n) => new Set(list.map(i => all[n].forms[i]))).reduce((a, b) => new Set([...a].filter(form => b.has(form)))) }];
  });
  return contexts.map((context, n) => {
    const exact: number[] = [];
    const rooted: number[] = [];
    shared.forEach(({ key, count, common }) => {
      const list = all[n].byKey.get(key)!;
      const chosen = [...list.filter(i => common.has(all[n].forms[i])), ...list.filter(i => !common.has(all[n].forms[i]))].slice(0, count);
      chosen.forEach(i => (common.has(all[n].forms[i]) ? exact : rooted).push(i));
    });
    return { ...context, match: { exact: exact.sort((x, y) => x - y), rooted: rooted.sort((x, y) => x - y) } };
  });
}
