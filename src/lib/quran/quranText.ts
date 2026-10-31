import { indexAyat, searchAyat, type AyahSearch, type IndexedAyah } from './ayahSearch';
import type { AyahContext, Surrounding } from './ayahContext';
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

function whenIdle(run: () => void) {
  (window.requestIdleCallback ?? ((later: () => void) => setTimeout(later, 0)))(run);
}

export function preloadQuranSearch() {
  whenIdle(() => void loadIndex().catch(() => {}));
}

/** Pages that open many overlays fetch the whole text once; the rest ask the server for the few ayat they show. */
export function preloadQuranText() {
  whenIdle(() => void loadQuranText().catch(() => {}));
}

async function ask<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  return response.json();
}

/** Each ayah with its neighbours, marking the words every one of them shares. */
export async function quranContexts(wanted: string[]): Promise<AyahContext[]> {
  if (!text) return ask(`/api/quran/context?${new URLSearchParams({ q: wanted.join(',') })}`);
  const [ayat, { ayahContexts, sharedByAll }] = await Promise.all([loadQuranText(), import('./ayahContext')]);
  const contexts = ayahContexts(ayat, wanted);
  if (contexts.length !== new Set(wanted).size) throw new Error('Ayah not found');
  return sharedByAll(contexts);
}

export async function quranSurrounding(before: string[], after: string[]): Promise<Surrounding> {
  if (!text) return ask(`/api/quran/surrounding?${new URLSearchParams({ before: before.join(','), after: after.join(',') })}`);
  const [ayat, { surrounding }] = await Promise.all([loadQuranText(), import('./ayahContext')]);
  return surrounding(ayat, before, after);
}
