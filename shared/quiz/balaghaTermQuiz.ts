import terms from '../data/quran/balaghaTerms';
import { BROAD_ITNAB, BROAD_TERMS, plainName, termSource, type BalaghaTerm } from '../quran/balaghaTerms';
import { uniqueSources } from './sources';
import { normalizeWord } from '../quran/normalize';
import { stem } from './ayahQuizText';
import { shuffle, type Random } from './random';
import type { ChoiceKind, ChoiceQuestion } from './choiceKinds';

export const TERM_QUIZ = 'TERM';
export const TERM_QUIZ_NAME = 'ما المصطلح؟';
const WRONG = 3;
const BROAD = new Set([...BROAD_TERMS, ...BROAD_ITNAB]);

const NAMING = new Set(['ويسمى', 'وتسمى', 'يسمى', 'تسمى', 'ويدعى', 'ويقال'].map(word => normalizeWord(word)));

const asked = (term: BalaghaTerm) => {
  const talkhis = term.quotes.filter(quote => quote.book === 'talkhis');
  return talkhis.length ? talkhis : term.quotes;
};

const plain = (word: string) => normalizeWord(word).replace(/[^ء-ي]/g, '').replace(/^[وف]/, '').replace(/^(?:بال|كال|لل|ال)/, '');

function core(word: string): string[] {
  const letters = plain(word).replace(/[اويىةءأإآؤئ]/g, '').replace(/(.)\1/g, '$1');
  const lead = (text: string) => { while (text.length > 3 && /^[تمنس]/.test(text)) text = text.slice(1); return text; };
  const trail = (text: string) => { while (text.length > 3 && /[هتنمي]$/.test(text)) text = text.slice(0, -1); return text; };
  return [trail(lead(letters)), lead(trail(letters))].filter(text => text.length >= 3);
}

const cores = (word: string) => {
  const bare = plain(word);
  return [...core(bare), ...(/^[بلك]/.test(bare) && bare.length > 3 ? core(bare.slice(1)) : [])];
};

const marksOf = new Map<string, { stems: Set<string>; cores: Set<string> }>();
const nameMarks = (name: string) => {
  const known = marksOf.get(name);
  if (known) return known;
  const words = plainName(name).split(/\s+/);
  const stemmed = words.map(word => stem(word) || plain(word)).filter(word => word.length >= 2);
  const marks = { stems: new Set(stemmed), cores: new Set(words.flatMap(cores)) };
  marksOf.set(name, marks);
  return marks;
};

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

export function hideName(text: string, name: string): string {
  const marks = nameMarks(name);
  const words = text.split(/(\s+)/);
  let afterNaming = false;
  return words.map(word => {
    if (/^\s+$/.test(word)) return word;
    const bare = normalizeWord(word).replace(/[^ء-ي]/g, '');
    if (afterNaming && (bare === 'له' || bare === 'ايضا')) return word;
    const hide = afterNaming || names(word, marks);
    afterNaming = NAMING.has(bare);
    if (hide) return word.replace(/[ء-يً-ٰٟ]+/g, '…').replace(/…+/g, '…');
    return word;
  }).join('');
}

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
const askable = () => defined().filter((term, i, all) => all.findIndex(other => asked(other).map(quote => quote.text).join() === asked(term).map(quote => quote.text).join()) === i);

function question(right: BalaghaTerm, random: Random): ChoiceQuestion | null {
  const quotes = asked(right);
  const text = quotes.map(quote => quote.text).join(' ');
  const chapter = right.kind <= 55;
  const wrong = shuffle(defined().filter(term => term !== right
    && !BROAD.has(term.name)
    && ![plainName(term.name), ...aliases(term)].some(name => namedIn(name, `${plainName(right.name)} ${text}`))
    && !term.quotes.some(quote => quotes.some(own => own.text === quote.text))
    && !(chapter && term.kind <= 55)), random).slice(0, WRONG);
  if (wrong.length < WRONG) return null;
  const choices = [right, ...wrong];
  const offered = shuffle(choices, random);
  return {
    key: `${TERM_QUIZ}:${right.name}`,
    family: TERM_QUIZ,
    promptArabic: 'أي مصطلح عُرِّف بهذا؟',
    passage: hideName(text, right.name),
    choices: offered.map(term => ({ value: term.name, labelArabic: plainName(term.name) })),
    correctAnswer: right.name,
    terms: Object.fromEntries(offered.map(term => [term.name, term.name])),
    sources: uniqueSources(quotes.map(termSource)),
    look: { view: 'terms', names: offered.map(term => term.name), mark: right.name },
    evidence: { claimKeys: [] },
  };
}

export const termQuiz: ChoiceKind = {
  id: TERM_QUIZ,
  name: TERM_QUIZ_NAME,
  party: true,
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
