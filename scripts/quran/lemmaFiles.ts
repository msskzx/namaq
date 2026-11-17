import { countLemmas, countPairs, lemmaPlaces, wordLemmas, type LemmaCount } from '../../src/lib/quran/lemmas';
import { OPPOSITES } from '../../src/lib/quran/opposites';
import { madinaSpelling } from './madinaSpelling';

/**
 * What buildLemmas writes from the Corpus morphology: the website's lemma counts and opposites (lemmas.json), each
 * lemma's places (places.json) and the app's lemmas of each word (words.json). Every lemma is stored in the Madina
 * page's spelling, the form the screens show (madinaSpelling.ts).
 */
export function lemmaFiles(morphology: string) {
  const notice = morphology.split(/\r?\n/).filter(line => line.startsWith('#')).join('\n');
  const spelled = (lemmas: LemmaCount[]) => lemmas.map(([lemma, ...rest]): LemmaCount => [madinaSpelling(lemma), ...rest]);
  const counted = countLemmas(morphology);
  const app = wordLemmas(morphology);
  return {
    lemmas: { notice, ...counted, lemmas: spelled(counted.lemmas), opposites: countPairs(morphology, OPPOSITES).map(pair => pair.map(side => ({ ...side, lemma: madinaSpelling(side.lemma) }))) },
    places: { notice, places: Object.fromEntries(Object.entries(lemmaPlaces(morphology)).map(([lemma, places]) => [madinaSpelling(lemma), places])) },
    words: { notice, ...app, lemmas: spelled(app.lemmas) },
  };
}
