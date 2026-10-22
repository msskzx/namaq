// docs/plans/quran-shared-openings.md
import { readerAyat, type BranchAyah } from './branches';

export type AyahContext = { ayah: BranchAyah; before: BranchAyah | null; after: BranchAyah | null };

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
