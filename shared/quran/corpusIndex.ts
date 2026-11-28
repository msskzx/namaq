import corpus from './quranText/corpus';
import type { BranchAyah } from './branches';
import { indexAyat, type IndexedAyah } from './ayahSearch';

const ayat = corpus.ayat as BranchAyah[];
let indexed: IndexedAyah[] | undefined;
const done: IndexedAyah[] = [];

export const corpusIndex = () => (indexed ??= [...done, ...indexAyat(ayat.slice(done.length))]);

const SLICE = 150;
let warming = false;

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
