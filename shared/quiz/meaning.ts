// «ما معنى؟» (owner, 2026-11-18; docs/plans/alfaz-al-quran.md): a word of an ayah and four meanings to pick from, every one
// Ibn Qutaybah's own words in «تفسير غريب القرآن»: the right one his meaning of the word, the wrong ones his meanings of
// other words of the same surah or the surahs beside it. Each question was read by hand and those where a wrong choice
// could also be right were dropped (scripts/quran/meaningReview.json). After answering, each wrong choice names its word.
import gharib from '../data/quran/gharib';
import corpus from '../quran/quranText/corpus';
import type { BranchAyah } from '../quran/branches';
import { filteredAyat } from '../quran/mutashabih/browse';
import { gharibCredit, type GharibEntry, GHARIB_SHORT } from '../quran/gharib';
import { num } from '../quran/arabicNumber';
import { SURAH_NAMES } from '../quran/surahNames';
import { shuffle, type Random } from './random';
import { givesAway } from './giveaway';
import type { ChoiceKind, ChoiceQuestion, ChoiceScope } from './choiceKinds';

export const MEANING = 'MEANING';
export const MEANING_NAME = 'ما معنى؟';

let ayat: Map<string, BranchAyah> | undefined;
const ayatByKey = () => (ayat ??= new Map((corpus.ayat as BranchAyah[]).map(ayah => [ayah.key, ayah])));

/** The ayah an entry asks about and the mushaf words it quotes there. */
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
  const pages = all.map(at => gharib.entries[at][1]);
  const [first, last] = [Math.min(...pages), Math.max(...pages)];
  return {
    key: `${MEANING}:${asked}`,
    family: MEANING,
    // The words asked are coloured in the ayah below, in the mushaf's font, so the prompt does not copy them in the text font.
    promptArabic: 'ما معنى ما لُوِّن من الآية؟',
    quran: place.words,
    number: place.ayah,
    marked: Array.from({ length: place.to - place.from + 1 }, (_, i) => place.from + i),
    choices: shuffle(all, random).map(at => ({ value: String(at), labelArabic: gharib.meanings[at] })),
    correctAnswer: String(asked),
    ayahKey: place.key,
    look: { view: 'word', key: place.key, word: place.from },
    explains,
    note: { label: 'المصدر', text: `كل الخيارات من ${first === last ? gharibCredit({ page: first }) : `${GHARIB_SHORT}، ص ${num(first)}–${num(last)}`}` },
    evidence: { claimKeys: [] },
  };
}

/**
 * The questions whose word is in the scope, in random order; the wrong meanings' words too (owner, 2026-11-19: a quiz on
 * juz 30 offers nothing from juz 29), as each question's choices were read by hand and are not swapped.
 */
function candidates(scope: ChoiceScope, random: Random) {
  const inScope = filteredAyat(ayatByKey(), scope.filters, scope.range);
  return shuffle(gharib.questions.filter(question => question.every(at => inScope.has(placeOf(gharib.entries[at]).key))), random);
}

/**
 * Not asked: a meaning the ayah already says beside its word («فرات» is «العذب» in «هذا عذب فرات»، «قبس» is «النار» after
 * «آنست نارا»; owner, 2026-11-19: no question holds its answer). Worked out once a question.
 */
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
