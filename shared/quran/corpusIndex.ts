import corpus from './quranText/corpus';
import type { BranchAyah } from './branches';
import { indexAyat, type IndexedAyah } from './ayahSearch';

const ayat = corpus.ayat as BranchAyah[];
let indexed: IndexedAyah[] | undefined;
/** The ayat indexed so far by warmCorpusIndex, in mushaf order. */
const done: IndexedAyah[] = [];

/**
 * The bundled Quran text indexed for word search, built the first time any search asks: one index for the reader's and the
 * app's search. What warmCorpusIndex has not reached yet is indexed here at once.
 */
export const corpusIndex = () => (indexed ??= [...done, ...indexAyat(ayat.slice(done.length))]);

/** Ayat a slice of the warm-up indexes: a few milliseconds on a phone, so the page stays free between slices. */
const SLICE = 150;
let warming = false;

/**
 * Builds the index ahead of the first search, a slice at a time when the page is idle, so a page with a search field does
 * not freeze while it is built (it took 1.6 s in one piece on a slow phone). The index is the same as corpusIndex's.
 */
export function warmCorpusIndex() {
  if (warming || indexed) return;
  warming = true;
  const idle = (next: () => void) => (typeof requestIdleCallback === 'function' ? requestIdleCallback(next, { timeout: 1000 }) : setTimeout(next, 16));
  const step = () => {
    if (indexed) return;
    done.push(...indexAyat(ayat.slice(done.length, done.length + SLICE)));
    if (done.length >= ayat.length) indexed = done.slice();
    else idle(step);
  };
  idle(step);
}
