// Recite a snippet (owner, 2026-11-13): an ayah's opening words from the chosen range, the reader recites the rest, shows
// it and says whether they had it. The opening is long enough that no other ayah starts the same way.
import corpus from '../data/quran/trees.json';
import surahRows from '../data/quran/surahs.json';
import type { BranchAyah } from '../quran/branches';
import { filteredAyat } from '../quran/mutashabih/browse';
import { normalizeWord } from '../quran/normalize';
import { num } from '../quran/arabicNumber';
import type { Difficulty } from './difficulty';
import { shuffle } from './random';
import { FORGOT, RECITE_SNIPPET, RECITED, type ChoiceKind, type ChoiceQuestion, type ChoiceScope } from './choiceKinds';

/** The opening shows at least this many words, and leaves at least this many to recite. */
const MIN_SHOWN = 3;
const MIN_LEFT = 3;
/** Easy shows two more words than the shortest opening no other ayah shares; medium one more; hard none. */
const EXTRA: Record<Difficulty, number> = { easy: 2, medium: 1, hard: 0 };

const names = Object.fromEntries(surahRows.map(row => [row.number, row.name])) as Record<number, string>;

type Index = { ayat: Map<string, BranchAyah>; opening: Map<string, number> };
let built: Index | undefined;

/** Built once: for each ayah, the fewest opening words no other ayah starts with (none when that leaves too little to recite). */
function index(): Index {
  if (built) return built;
  const all = corpus.ayat as BranchAyah[];
  const norm = all.map(ayah => ({ key: ayah.key, words: ayah.words.map(normalizeWord) }));
  // Sorted word by word, the ayah sharing the longest opening with another sits next to it.
  const compare = (a: string[], b: string[]) => {
    for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
    return a.length - b.length;
  };
  const shared = (a: string[] | undefined, b: string[]) => {
    let n = 0;
    while (a && n < a.length && n < b.length && a[n] === b[n]) n++;
    return n;
  };
  norm.sort((a, b) => compare(a.words, b.words));
  const opening = new Map<string, number>();
  norm.forEach(({ key, words }, i) => {
    const n = Math.max(MIN_SHOWN, shared(norm[i - 1]?.words, words) + 1, shared(norm[i + 1]?.words, words) + 1);
    if (n <= words.length - MIN_LEFT) opening.set(key, n);
  });
  return (built = { ayat: new Map(all.map(ayah => [ayah.key, ayah])), opening });
}

const inScope = (scope: ChoiceScope) => {
  const { ayat, opening } = index();
  return [...filteredAyat(ayat, scope.filters, scope.range).values()].filter(ayah => opening.has(ayah.key));
};

function question(ayah: BranchAyah, difficulty: Difficulty): ChoiceQuestion {
  const [surah, number] = ayah.key.split(':').map(Number);
  const shown = Math.min(index().opening.get(ayah.key)! + EXTRA[difficulty], ayah.words.length - MIN_LEFT);
  return {
    key: `${RECITE_SNIPPET}:${ayah.key}`,
    family: RECITE_SNIPPET,
    promptArabic: `سمّع بقية الآية، ثم أظهرها. ${names[surah]} ${num(number)}`,
    quran: ayah.words.slice(0, shown),
    reveal: ayah.words.slice(shown),
    choices: [{ value: RECITED, labelArabic: 'حفظتها' }, { value: FORGOT, labelArabic: 'نسيتها' }],
    correctAnswer: RECITED,
    ayahKey: ayah.key,
    evidence: { claimKeys: [] },
  };
}

export const reciteSnippet: ChoiceKind = {
  id: RECITE_SNIPPET,
  name: 'سمّع بقية الآية',
  party: false,
  // The difficulty only changes how much of the opening is shown.
  questions: (scope, difficulty, random, limit = Infinity) => shuffle(inScope(scope), random).slice(0, limit).map(ayah => question(ayah, difficulty)),
  count: scope => inScope(scope).length,
};
