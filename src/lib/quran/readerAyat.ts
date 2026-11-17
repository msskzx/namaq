import { pageAyat, type BranchAyah } from '@shared/quran/branches';
import type { MushafPage } from '@shared/quran/readerPage';
import treeData from '@shared/data/quran/trees.json';

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
