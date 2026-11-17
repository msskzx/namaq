import corpus from './quranText/corpus';
import type { BranchAyah } from './branches';
import { indexAyat, type IndexedAyah } from './ayahSearch';

let indexed: IndexedAyah[] | undefined;
/** The bundled Quran text indexed for word search, built the first time any search asks: one index for the reader's and the app's search. */
export const corpusIndex = () => (indexed ??= indexAyat(corpus.ayat as BranchAyah[]));
