import { indexAyat, searchAyat, type AyahSearch, type IndexedAyah } from './ayahSearch';
import type { BranchAyah } from './branches';

let text: Promise<BranchAyah[]> | undefined;
let index: Promise<IndexedAyah[]> | undefined;

export function loadQuranText(): Promise<BranchAyah[]> {
  return (text ??= fetch('/api/quran/text')
    .then(response => (response.ok ? response.json() : Promise.reject(new Error(`Quran text: ${response.status}`))))
    .catch(error => {
      text = undefined;
      throw error;
    }));
}

const loadIndex = () =>
  (index ??= loadQuranText()
    .then(indexAyat)
    .catch(error => {
      index = undefined;
      throw error;
    }));

export const searchQuran = async (query: string): Promise<AyahSearch> => searchAyat(await loadIndex(), query);

export function preloadQuranSearch() {
  const idle = window.requestIdleCallback ?? ((run: () => void) => setTimeout(run, 0));
  idle(() => void loadIndex().catch(() => {}));
}
