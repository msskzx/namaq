// «في أيّ كتاب؟» (owner's sketch, 2026-11-19: the Sahihayn's feature gets a quiz kind): a bab heading of Sahih al-Bukhari
// (his own words) or Sahih Muslim (al-Nawawi's, and the question says so), and the kitab it stands in. The headings ship with
// the app (shared/data/hadith/*.json), so a question is the same on every phone and in a party.
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

/** A heading's words as matched: no marks, one alif, no article, no «باب» or «كتاب». */
const words = (text: string) => text.split(/\s+/).map(word => normalizeWord(word).replace(/[^ء-ي]/g, '').replace(/^(?:[وفبلك]?ال)(?=\S{2})/, ''))
  .filter(word => word && word !== 'باب' && word !== 'كتاب' && word !== 'ابواب');

/** A kitab's name says what its babs are about («كتاب الوضوء» over «باب فضل الوضوء»): a bab sharing a word with it is not asked. */
/** A kitab as a choice: the print marks some kitab names and not others, so all are shown bare, lest the marked one stand out. */
const label = (kitab: SahihKitab) => kitab.title.replace(/[ً-ْٰ]/g, '').replace(/[.،]+$/, '').trim();

const named = (kitab: SahihKitab, title: string) => { const mine = new Set(words(title)); return words(kitab.title).some(word => word.length > 2 && mine.has(word)); };

export function sahihKitabQuestions(random: Random): ChoiceQuestion[] {
  return shuffle(BOOKS.flatMap(book => {
    // A heading printed in more than one kitab (al-Bukhari repeats some) answers to each: those kitabs are never wrong.
    const homes = new Map<string, Set<number>>();
    for (const kitab of book.kitabs) for (const bab of kitab.babs) {
      const key = words(bab.title).join(' ');
      homes.set(key, (homes.get(key) ?? new Set()).add(kitab.n));
    }
    return book.kitabs.flatMap(kitab => kitab.babs.flatMap((bab, i) => {
      const key = words(bab.title).join(' ');
      // A heading of one word or none («باب» alone, as al-Bukhari leaves some) says too little to ask.
      if (words(bab.title).length < 3 || !bab.from || named(kitab, bab.title)) return [];
      const wrong = shuffle(book.kitabs.filter(other => !homes.get(key)!.has(other.n) && !named(other, bab.title)), random).slice(0, CHOICES - 1);
      if (wrong.length < CHOICES - 1) return [];
      const choices = shuffle([kitab, ...wrong], random);
      const asked = book.headingsBy === 'nawawi' ? `في أيّ كتاب من ${book.title} بوّب النووي هذا الباب؟` : `في أيّ كتاب من ${book.title} هذا الباب؟`;
      return [{
        key: `${SAHIH_KITAB}:${book.slug}:${kitab.n}:${i}`,
        family: SAHIH_KITAB,
        promptArabic: `${bab.title}\n${asked}`,
        choices: choices.map((each, at) => ({ value: String(at), labelArabic: label(each) })),
        correctAnswer: String(choices.indexOf(kitab)),
        note: { label: 'المصدر', text: `${book.title}، ${kitab.title}، الحديث ${num(bab.from)}${book.headingsBy === 'nawawi' ? '، وتراجم الأبواب للنووي' : ''}` },
        look: { view: 'sahih', book: book.slug, mark: kitab.n },
        evidence: { claimKeys: [] },
      } satisfies ChoiceQuestion];
    }));
  }), random);
}

export const sahihKitabQuiz: ChoiceKind = {
  id: SAHIH_KITAB,
  name: SAHIH_KITAB_NAME,
  party: true,
  questions: (_scope, _difficulty, random, limit = Infinity) => sahihKitabQuestions(random).slice(0, limit),
  count: () => sahihKitabQuestions(Math.random).length,
};
