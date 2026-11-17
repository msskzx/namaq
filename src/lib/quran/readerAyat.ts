import { pageAyat, type BranchAyah } from '@shared/quran/branches';
import type { MushafPage } from '@shared/quran/readerPage';
import treeData from '@shared/quran/quranText/corpus';

let source: Promise<BranchAyah[]> | undefined;

/** Every ayah's words as the Madina pages print them (AGENTS.md, "Quran text"), with the corpus roots and lemmas the trees carry. */
export function loadReaderAyat(): Promise<BranchAyah[]> {
  return source ??= Promise.all(Array.from({ length: 604 }, (_, i) => import(`../../../shared/data/quran/mushaf/${i + 1}.json`)))
    .then(pages => {
      const morphology = new Map(treeData.ayat.map(ayah => [ayah.key, ayah]));
      return pageAyat(pages.map(page => page.default as MushafPage)).map(ayah => {
        const source = morphology.get(ayah.key);
        return { ...ayah, roots: source?.roots, lemmas: source?.lemmas };
      });
    })
    .catch(error => { source = undefined; throw error; });
}

let texts: Promise<(surah: number, ayah: number) => string> | undefined;
/** An ayah's text as the Madina page prints it: for code that still reads an ayah row from the database, whose own text is an older copy and is never shown. */
export const loadAyahText = () => texts ??= loadReaderAyat().then(ayat => {
  const byKey = new Map(ayat.map(ayah => [ayah.key, ayah.words.join(' ')]));
  return (surah: number, ayah: number) => {
    const text = byKey.get(`${surah}:${ayah}`);
    if (text === undefined) throw new Error(`No Madina page has ${surah}:${ayah}`);
    return text;
  };
});
