import bukhari from '../data/hadith/bukhari.json';
import muslim from '../data/hadith/muslim.json';
import { normalizeWord } from '../quran/normalize';
import { num } from '../quran/arabicNumber';
import type { SahihIndex, SahihKitab } from '../sahih';
import { shuffle, type Random } from './random';
import type { ChoiceKind, ChoiceQuestion } from './choiceKinds';

export const SAHIH_KITAB = 'SAHIH_KITAB';
export const SAHIH_KITAB_NAME = 'في أيّ كتاب؟';
const CHOICES = 4;
const BOOKS = [bukhari, muslim] as SahihIndex[];

const seen = new Map<string, string[]>();
const words = (text: string) => seen.get(text) ?? seen.set(text, wordsOf(text)).get(text)!;
const wordsOf = (text: string) => text.split(/\s+/).map(word => normalizeWord(word).replace(/[^ء-ي]/g, '').replace(/^(?:[وفبلك]?ال)(?=\S{2})/, ''))
  .filter(word => word && word !== 'باب' && word !== 'كتاب' && word !== 'ابواب');

const LITTLE = new Set(['في', 'من', 'ما', 'عن', 'علي', 'الي', 'وغيرها', 'وغيره', 'رضي', 'الله', 'تعالي', 'عنهم', 'جاء']);
const core = (word: string) => word.replace(/^[وفبلك]?(?:ال|لل)/, '').replace(/(?:ات|ه|ها|هم|ين|ون)$/, '') || word;

const skeletons = new Map<string, string>();
const skeleton = (word: string) => skeletons.get(word) ?? skeletons.set(word, core(word).replace(/[اويىءئؤةهت]/g, '')).get(word)!;
const near = (a: string, b: string) => a.includes(b) || (a.length >= 3 && b.includes(a))
  || (skeleton(a).length >= 3 && skeleton(b).length >= 3 && (skeleton(a).includes(skeleton(b)) || skeleton(b).includes(skeleton(a))));
const kitabWords = new Map<SahihKitab, string[]>();
const cores = new Map<string, string[]>();
const named = (kitab: SahihKitab, title: string) => {
  const mine = cores.get(title) ?? cores.set(title, words(title).map(core)).get(title)!;
  if (!kitabWords.has(kitab)) kitabWords.set(kitab, words(kitab.title).filter(word => !LITTLE.has(word)).map(core).filter(word => word.length >= 2));
  return kitabWords.get(kitab)!.some(word => mine.some(other => near(other, word)));
};
const label = (kitab: SahihKitab) => kitab.title.replace(/[ً-ْٰ]/g, '').replace(/[.،]+$/, '').trim();

type Asked = { book: SahihIndex; kitab: SahihKitab; i: number; wrong: SahihKitab[] };
let asked: Asked[] | undefined;
function askable(): Asked[] {
  return asked ??= BOOKS.flatMap(book => {
    const homes = new Map<string, Set<number>>();
    for (const kitab of book.kitabs) for (const bab of kitab.babs) {
      const key = words(bab.title).join(' ');
      homes.set(key, (homes.get(key) ?? new Set()).add(kitab.n));
    }
    return book.kitabs.flatMap(kitab => kitab.babs.flatMap((bab, i) => {
      const said = words(bab.title);
      if (said.length < 3 || !bab.from || named(kitab, bab.title)) return [];
      if (/^و?(?:قول|قوله|قولوا|حدثنا)$/.test(said[0] ?? '') || /﴿/.test(bab.title)) return [];
      const wrong = book.kitabs.filter(other => !homes.get(said.join(' '))!.has(other.n) && !named(other, bab.title));
      return wrong.length >= CHOICES - 1 ? [{ book, kitab, i, wrong }] : [];
    }));
  });
}

export function sahihKitabQuestions(random: Random, limit = Infinity): ChoiceQuestion[] {
  return shuffle(askable(), random).slice(0, limit).map(({ book, kitab, i, wrong }) => {
    const bab = kitab.babs[i];
    const choices = shuffle([kitab, ...shuffle(wrong, random).slice(0, CHOICES - 1)], random);
    const ask = book.headingsBy === 'nawawi' ? `في أيّ كتاب من ${book.title} بوّب النووي هذا الباب؟` : `في أيّ كتاب من ${book.title} هذا الباب؟`;
    return {
      key: `${SAHIH_KITAB}:${book.slug}:${kitab.n}:${i}`,
      family: SAHIH_KITAB,
      promptArabic: `${bab.title}\n${ask}`,
      choices: choices.map((each, at) => ({ value: String(at), labelArabic: label(each) })),
      correctAnswer: String(choices.indexOf(kitab)),
      sources: [{ book: book.title, at: `${kitab.title}، الحديث ${num(bab.from)}`, quote: bab.title, ...(book.headingsBy === 'nawawi' && { by: 'تبويب النووي' }) }],
      look: { view: 'sahih', book: book.slug, mark: kitab.n },
      evidence: { claimKeys: [] },
    } satisfies ChoiceQuestion;
  });
}

export const sahihKitabQuiz: ChoiceKind = {
  id: SAHIH_KITAB,
  name: SAHIH_KITAB_NAME,
  party: true,
  questions: (_scope, _difficulty, random, limit = Infinity) => sahihKitabQuestions(random, limit),
  count: () => askable().length,
};
