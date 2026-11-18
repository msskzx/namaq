// «ما المصطلح؟» (owner, 2026-11-18): a balagha term's definition in the scholar's own words, the term's name hidden in it,
// and four terms of «مصطلحات البلاغة» to pick from. Only terms whose quotes define them are asked (shared/quran/balaghaTerms.ts).
// A wrong choice never shares a word with the right term or with the definition, so it cannot also be right or named in it.
// Once answered, each choice links to its term's page.
import terms from '../data/quran/balaghaTerms';
import { plainName, termCredit, type BalaghaTerm } from '../quran/balaghaTerms';
import { normalizeWord } from '../quran/normalize';
import { stem } from './ayahQuizText';
import { shuffle, type Random } from './random';
import type { ChoiceKind, ChoiceQuestion } from './choiceKinds';

export const TERM_QUIZ = 'TERM';
export const TERM_QUIZ_NAME = 'ما المصطلح؟';
/** Wrong choices beside the right one. */
const WRONG = 3;

/** The words that name a term to a reader: «وتسمى الطباق» names المطابقة, «ويسمى بالاحتراس» names التكميل. */
const NAMING = new Set(['ويسمى', 'وتسمى', 'يسمى', 'تسمى', 'ويدعى', 'ويقال'].map(word => normalizeWord(word)));

/** The quotes a question shows: al-Qazwini's where he stands in for al-Suyuti, else al-Suyuti's. */
const asked = (term: BalaghaTerm) => {
  const talkhis = term.quotes.filter(quote => quote.book === 'talkhis');
  return talkhis.length ? talkhis : term.quotes;
};

/** A word of a term's name as `stem` reads it, but a two-letter one kept: «اللف» is لف. */
const nameStem = (word: string) => stem(word) || normalizeWord(word).replace(/[^ء-ي]/g, '').replace(/^[وف]/, '').replace(/^(?:بال|كال|لل|ال)/, '');
const nameStems = (name: string) => new Set(plainName(name).split(/\s+/).map(nameStem).filter(word => word.length >= 2));

/** The definition with every word of the term's name, and each other name it gives, written «…». */
export function hideName(text: string, name: string): string {
  const hidden = nameStems(name);
  const words = text.split(/(\s+)/);
  let afterNaming = false;
  return words.map(word => {
    if (/^\s+$/.test(word)) return word;
    const bare = normalizeWord(word).replace(/[^ء-ي]/g, '');
    // A naming word's next word is the other name; «ويقال له القصر» skips «له» first.
    if (afterNaming && bare === 'له') return word;
    const hide = afterNaming || hidden.has(nameStem(word));
    afterNaming = NAMING.has(bare);
    if (hide) return word.replace(/[ء-يً-ٰٟ]+/g, '…').replace(/…+/g, '…');
    return word;
  }).join('');
}

const defined = () => terms.terms.filter(term => term.defines);
/** The terms asked: those defined, but one of two that share their definition (الحذف and إيجاز الحذف), the first. */
const askable = () => defined().filter((term, i, all) => all.findIndex(other => asked(other).map(quote => quote.text).join() === asked(term).map(quote => quote.text).join()) === i);

function question(right: BalaghaTerm, random: Random): ChoiceQuestion | null {
  const quotes = asked(right);
  const text = quotes.map(quote => quote.text).join(' ');
  const rightWords = nameStems(right.name);
  // The definition's letters without marks: a wrong term named in it in any form («التفاتا» for الالتفات) is not offered.
  const bare = normalizeWord(text);
  // Two broad chapters (a مجاز and a metaphor, a kinaya) are never right and wrong in one question.
  const chapter = right.kind <= 55;
  const wrong = shuffle(defined().filter(term => term !== right
    && ![...nameStems(term.name)].some(word => rightWords.has(word) || bare.includes(word))
    && !term.quotes.some(quote => quotes.some(own => own.text === quote.text))
    && !(chapter && term.kind <= 55)), random).slice(0, WRONG);
  if (wrong.length < WRONG) return null;
  const choices = [right, ...wrong];
  const pages = quotes.map(termCredit);
  return {
    key: `${TERM_QUIZ}:${right.name}`,
    family: TERM_QUIZ,
    promptArabic: 'أي مصطلح عُرِّف بهذا؟',
    passage: hideName(text, right.name),
    choices: shuffle(choices, random).map(term => ({ value: term.name, labelArabic: plainName(term.name) })),
    correctAnswer: right.name,
    terms: Object.fromEntries(choices.map(term => [term.name, term.name])),
    note: { label: 'المصدر', text: [...new Set(pages)].join('؛ ') },
    evidence: { claimKeys: [] },
  };
}

export const termQuiz: ChoiceKind = {
  id: TERM_QUIZ,
  name: TERM_QUIZ_NAME,
  party: true,
  // Terms are not in a part of the Quran, so the scope asks them all.
  questions: (_scope, _difficulty, random, limit = Infinity) => {
    const out: ChoiceQuestion[] = [];
    for (const term of shuffle(askable(), random)) {
      if (out.length >= limit) break;
      const asked = question(term, random);
      if (asked) out.push(asked);
    }
    return out;
  },
  count: () => askable().length,
};
