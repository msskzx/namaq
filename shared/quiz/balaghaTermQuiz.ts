// «ما المصطلح؟» (owner, 2026-11-18): a balagha term's definition in the scholar's own words, the term's name hidden in it,
// and four terms of «مصطلحات البلاغة» to pick from. Only terms whose quotes define them are asked (shared/quran/balaghaTerms.ts).
// A wrong choice never shares a word with the right term or with the definition, so it cannot also be right or named in it.
// Once answered, each choice links to its term's page.
import terms from '../data/quran/balaghaTerms';
import { BROAD_ITNAB, BROAD_TERMS, plainName, termCredit, type BalaghaTerm } from '../quran/balaghaTerms';
import { normalizeWord } from '../quran/normalize';
import { stem } from './ayahQuizText';
import { shuffle, type Random } from './random';
import type { ChoiceKind, ChoiceQuestion } from './choiceKinds';

export const TERM_QUIZ = 'TERM';
export const TERM_QUIZ_NAME = 'ما المصطلح؟';
/** Wrong choices beside the right one. */
const WRONG = 3;
const BROAD = new Set([...BROAD_TERMS, ...BROAD_ITNAB]);

/** The words that name a term to a reader: «وتسمى الطباق» names المطابقة, «ويسمى بالاحتراس» names التكميل. */
const NAMING = new Set(['ويسمى', 'وتسمى', 'يسمى', 'تسمى', 'ويدعى', 'ويقال'].map(word => normalizeWord(word)));

/** The quotes a question shows: al-Qazwini's where he stands in for al-Suyuti, else al-Suyuti's. */
const asked = (term: BalaghaTerm) => {
  const talkhis = term.quotes.filter(quote => quote.book === 'talkhis');
  return talkhis.length ? talkhis : term.quotes;
};

/** A word's letters without marks, and without a leading و or ف and the article. */
const plain = (word: string) => normalizeWord(word).replace(/[^ء-ي]/g, '').replace(/^[وف]/, '').replace(/^(?:بال|كال|لل|ال)/, '');

/**
 * The letters a word's forms share, so «المنسجم» meets الانسجام and «فيستقصيه» meets الاستقصاء: its letters without the
 * long vowels and hamza, a doubled letter once, then a leading ت, م, ن or س (the forms' added letters) and a trailing
 * pronoun or plural letter taken off while more than three are left, in either order. Shorter than three letters says nothing.
 */
function core(word: string): string[] {
  const letters = plain(word).replace(/[اويىةءأإآؤئ]/g, '').replace(/(.)\1/g, '$1');
  const lead = (text: string) => { while (text.length > 3 && /^[تمنس]/.test(text)) text = text.slice(1); return text; };
  const trail = (text: string) => { while (text.length > 3 && /[هتنمي]$/.test(text)) text = text.slice(0, -1); return text; };
  return [trail(lead(letters)), lead(trail(letters))].filter(text => text.length >= 3);
}

/** A word's cores, with and without a leading ب, ل or ك («بقسم» is قسم). */
const cores = (word: string) => {
  const bare = plain(word);
  return [...core(bare), ...(/^[بلك]/.test(bare) && bare.length > 3 ? core(bare.slice(1)) : [])];
};

const marksOf = new Map<string, { stems: Set<string>; cores: Set<string> }>();
/** What names a term: each word of its name as `stem` reads it (a two-letter one kept: «اللف»), and its core; worked out once a name. */
const nameMarks = (name: string) => {
  const known = marksOf.get(name);
  if (known) return known;
  const words = plainName(name).split(/\s+/);
  const stemmed = words.map(word => stem(word) || plain(word)).filter(word => word.length >= 2);
  const marks = { stems: new Set(stemmed), cores: new Set(words.flatMap(cores)) };
  marksOf.set(name, marks);
  return marks;
};

/** Whether a word of a definition is a form of the name: the same stem, the stem with a suffix («ترتيبها»), or the same core. */
const readings = new Map<string, { bare: string; stem: string; cores: string[] }>();
const reading = (word: string) => {
  let known = readings.get(word);
  if (!known) readings.set(word, known = { bare: plain(word), stem: stem(word) || plain(word), cores: cores(word) });
  return known;
};
const names = (word: string, marks: ReturnType<typeof nameMarks>) => {
  const { bare, stem: stemmed, cores: letters } = reading(word);
  return marks.stems.has(stemmed) || [...marks.stems].some(name => name.length >= 3 && bare.startsWith(name)) || letters.some(core => marks.cores.has(core));
};

/** The definition with every form of a word of the term's name, and each other name it gives, written «…». */
export function hideName(text: string, name: string): string {
  const marks = nameMarks(name);
  const words = text.split(/(\s+)/);
  let afterNaming = false;
  return words.map(word => {
    if (/^\s+$/.test(word)) return word;
    const bare = normalizeWord(word).replace(/[^ء-ي]/g, '');
    // A naming word's next word is the other name; «ويقال له القصر» skips «له» first, «ويقال أيضًا» «أيضًا».
    if (afterNaming && (bare === 'له' || bare === 'ايضا')) return word;
    const hide = afterNaming || names(word, marks);
    afterNaming = NAMING.has(bare);
    if (hide) return word.replace(/[ء-يً-ٰٟ]+/g, '…').replace(/…+/g, '…');
    return word;
  }).join('');
}

/** Whether a term is named in a text, in any of its forms. */
const textsRead = new Map<string, { stems: Set<string>; bares: string[]; cores: Set<string> }>();
export function namedIn(term: string, text: string) {
  let read = textsRead.get(text);
  if (!read) {
    const words = text.split(/\s+/).filter(Boolean).map(reading);
    textsRead.set(text, read = { stems: new Set(words.map(word => word.stem)), bares: words.map(word => word.bare), cores: new Set(words.flatMap(word => word.cores)) });
  }
  const marks = nameMarks(term);
  const { bares, stems: shown, cores: shownCores } = read;
  return [...marks.stems].some(name => shown.has(name) || (name.length >= 3 && bares.some(bare => bare.startsWith(name)))) || [...marks.cores].some(core => shownCores.has(core));
}

/** The other names a term's own definition gives it («ويدعى التورية» for الإيهام), each the word after a naming word. */
const aliasesOf = new Map<BalaghaTerm, string[]>();
function aliases(term: BalaghaTerm): string[] {
  const known = aliasesOf.get(term);
  if (known) return known;
  const out: string[] = [];
  aliasesOf.set(term, out);
  for (const quote of asked(term)) {
    const words = quote.text.split(/\s+/);
    words.forEach((word, i) => {
      if (!NAMING.has(normalizeWord(word).replace(/[^ء-ي]/g, ''))) return;
      const next = words.slice(i + 1).find(after => !['له', 'ايضا'].includes(normalizeWord(after).replace(/[^ء-ي]/g, '')));
      if (next && plain(next).length >= 3) out.push(next);
    });
  }
  return out;
}

const defined = () => terms.terms.filter(term => term.defines);
/** The terms asked: those defined, but one of two that share their definition (الحذف and إيجاز الحذف), the first. */
const askable = () => defined().filter((term, i, all) => all.findIndex(other => asked(other).map(quote => quote.text).join() === asked(term).map(quote => quote.text).join()) === i);

function question(right: BalaghaTerm, random: Random): ChoiceQuestion | null {
  const quotes = asked(right);
  const text = quotes.map(quote => quote.text).join(' ');
  // Two broad chapters (a مجاز and a metaphor, a kinaya) are never right and wrong in one question, and a term that holds
  // others is never wrong: a تذييل's definition is one of a إطناب بالزيادة too.
  const chapter = right.kind <= 55;
  const wrong = shuffle(defined().filter(term => term !== right
    && !BROAD.has(term.name)
    // No wrong term shares a word's form with the right one or is named in the definition («التفاتا» for الالتفات).
    && ![plainName(term.name), ...aliases(term)].some(name => namedIn(name, `${plainName(right.name)} ${text}`))
    && !term.quotes.some(quote => quotes.some(own => own.text === quote.text))
    && !(chapter && term.kind <= 55)), random).slice(0, WRONG);
  if (wrong.length < WRONG) return null;
  const choices = [right, ...wrong];
  const pages = quotes.map(termCredit);
  // In the order shown, so the look's list never puts the right one first.
  const offered = shuffle(choices, random);
  return {
    key: `${TERM_QUIZ}:${right.name}`,
    family: TERM_QUIZ,
    promptArabic: 'أي مصطلح عُرِّف بهذا؟',
    passage: hideName(text, right.name),
    choices: offered.map(term => ({ value: term.name, labelArabic: plainName(term.name) })),
    correctAnswer: right.name,
    terms: Object.fromEntries(choices.map(term => [term.name, term.name])),
    note: { label: 'المصدر', text: [...new Set(pages)].join('؛ ') },
    look: { view: 'terms', names: offered.map(term => term.name), mark: right.name },
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
