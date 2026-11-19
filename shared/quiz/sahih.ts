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

/** Little words a kitab's name holds that say nothing of its subject. */
const LITTLE = new Set(['في', 'من', 'ما', 'عن', 'علي', 'الي', 'وغيرها', 'وغيره', 'رضي', 'الله', 'تعالي', 'عنهم', 'جاء']);
/** A word's core for matching: no joined «و ف ب ل ك», no article, no «ة» or plural «ات», no joined pronoun. */
const core = (word: string) => word.replace(/^[وفبلك]?(?:ال|لل)/, '').replace(/(?:ات|ه|ها|هم|ين|ون)$/, '') || word;

/**
 * A kitab's name says what its babs are about («كتاب الوضوء» over «باب فضل الوضوء», «كتاب الحيض» over «باب إقبال
 * المحيض», «كتاب الفتن» over «باب فتنة…»): a bab whose words hold the core of a word of the kitab's name is not asked under
 * it, nor offered as wrong. It errs on the side of leaving a question out.
 */
/** A word's letters without the long vowels, hamza, «ة» and «ت», near enough its root: «اعتمار» and «عمرة» both «عمر». */
const skeleton = (word: string) => core(word).replace(/[اويىءئؤةهت]/g, '');
const near = (a: string, b: string) => a.includes(b) || (a.length >= 3 && b.includes(a))
  || (skeleton(a).length >= 3 && skeleton(b).length >= 3 && (skeleton(a).includes(skeleton(b)) || skeleton(b).includes(skeleton(a))));
const named = (kitab: SahihKitab, title: string) => {
  const mine = words(title).map(core);
  return words(kitab.title).filter(word => !LITTLE.has(word)).map(core).some(word => word.length >= 2 && mine.some(other => near(other, word)));
};

/** A kitab as a choice: the print marks some kitab names and not others, so all are shown bare, lest the marked one stand out. */
const label = (kitab: SahihKitab) => kitab.title.replace(/[ً-ْٰ]/g, '').replace(/[.،]+$/, '').trim();

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
      // A heading of two words or fewer after «باب» («باب» alone, as al-Bukhari leaves some) says too little to ask.
      if (words(bab.title).length < 3 || !bab.from || named(kitab, bab.title)) return [];
      // An ayah as a heading («باب قول الله تعالى…», «باب قوله…») stands in tafsir and in its subject's kitab alike, and a
      // heading that is a chain («باب حدثنا…») names no subject: neither is asked.
      if (/^و?(?:قول|قوله|قولوا|حدثنا)$/.test(words(bab.title)[0] ?? '') || /﴿/.test(bab.title)) return [];
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
