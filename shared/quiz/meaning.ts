// see docs/plans/alfaz-al-quran.md
import gharib from '../data/quran/gharib';
import corpus from '../quran/quranText/corpus';
import type { BranchAyah } from '../quran/branches';
import { filteredAyat } from '../quran/mutashabih/browse';
import { GHARIB_BOOK, gharibPage, type GharibEntry } from '../quran/gharib';
import { num } from '../quran/arabicNumber';
import { SURAH_NAMES } from '../quran/surahNames';
import { shuffle, type Random } from './random';
import { givesAway } from './giveaway';
import type { ChoiceKind, ChoiceQuestion, ChoiceScope } from './choiceKinds';

export const MEANING = 'MEANING';
export const MEANING_NAME = 'ما معنى؟';

let ayat: Map<string, BranchAyah> | undefined;
const ayatByKey = () => (ayat ??= new Map((corpus.ayat as BranchAyah[]).map(ayah => [ayah.key, ayah])));

function placeOf(entry: GharibEntry) {
  const [ayah, from, to] = entry[4][0];
  const key = `${entry[0]}:${ayah}`;
  const words = ayatByKey().get(key)?.words ?? [];
  return { key, ayah, from, to, words, quote: words.slice(from, to + 1).join(' ') };
}

function question(asked: number, others: number[], random: Random): ChoiceQuestion {
  const entry = gharib.entries[asked];
  const place = placeOf(entry);
  const all = [asked, ...others];
  const explains = Object.fromEntries(others.map(at => {
    const other = placeOf(gharib.entries[at]);
    return [String(at), { quote: other.quote, where: `${SURAH_NAMES[gharib.entries[at][0]]} ${num(other.ayah)}` }];
  }));
  return {
    key: `${MEANING}:${asked}`,
    family: MEANING,
    promptArabic: 'ما معنى ما لُوِّن من الآية؟',
    quran: place.words,
    number: place.ayah,
    marked: Array.from({ length: place.to - place.from + 1 }, (_, i) => place.from + i),
    choices: shuffle(all, random).map(at => ({ value: String(at), labelArabic: gharib.meanings[at] })),
    correctAnswer: String(asked),
    ayahKey: place.key,
    look: { view: 'word', key: place.key, word: place.from },
    explains,
    sources: [{ book: GHARIB_BOOK, author: 'ابن قتيبة', at: `ص ${num(entry[1])}`, quote: gharib.meanings[asked], url: gharibPage({ id: entry[2] }) }],
    evidence: { claimKeys: [] },
  };
}

function candidates(scope: ChoiceScope, random: Random) {
  const inScope = filteredAyat(ayatByKey(), scope.filters, scope.range);
  return shuffle(gharib.questions.filter(question => question.every(at => inScope.has(placeOf(gharib.entries[at]).key))), random);
}

const told = new Map<number, boolean>();
const tellsItself = (row: number[]) => {
  let found = told.get(row[0]);
  if (found === undefined) told.set(row[0], (found = !!givesAway(question(row[0], row.slice(1), () => 0))));
  return found;
};

export const meaningQuiz: ChoiceKind = {
  id: MEANING,
  name: MEANING_NAME,
  party: true,
  questions: (scope, _difficulty, random, limit = Infinity) =>
    candidates(scope, random).filter(row => !tellsItself(row)).slice(0, limit).map(([asked, ...others]) => question(asked, others, random)),
  count: scope => candidates(scope, Math.random).filter(row => !tellsItself(row)).length,
};
