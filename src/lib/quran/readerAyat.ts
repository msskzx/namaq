import { readerAyat, type BranchAyah } from './branches';
import { mushafPages } from './readerPage';
import treeData from '@/app/quran/branches/trees.json';

let source: Promise<BranchAyah[]> | undefined;

export function loadReaderAyat(): Promise<BranchAyah[]> {
  const all = <T,>(load: (page: number) => Promise<T>) => Promise.all(Array.from({ length: 604 }, (_, i) => load(i + 1)));
  return source ??= Promise.all([all(page => import(`../../app/quran/read/data/${page}.json`)), all(page => import(`../../app/quran/read/mushaf/${page}.json`))])
    .then(([pages, mushaf]) => {
      const morphology = new Map(treeData.ayat.map(ayah => [ayah.key, ayah]));
      return readerAyat(pages.map(page => page.default), mushafPages(mushaf.map(page => page.default))).map(ayah => {
        const source = morphology.get(ayah.key);
        return { ...ayah, roots: source?.roots, lemmas: source?.lemmas };
      });
    })
    .catch(error => { source = undefined; throw error; });
}
