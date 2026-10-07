// docs/adr/0027-a-date-is-read-from-its-quote-and-the-number-is-checked.md
import { HARAKAT } from './span';
import type { Predicate } from './types';

const normalize = (text: string) =>
  text
    .replace(HARAKAT, '')
    .replace(/ـ/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x660));

const tokens = (text: string) => normalize(text).split(/[^\p{L}\p{N}]+/u).filter(Boolean);

type Slot = 'unit' | 'teen' | 'ten' | 'hundred' | 'digits';
type Piece = { slot: Slot; value: number; bare?: boolean };

const UNIT_WORDS: Record<number, string[]> = {
  1: ['واحد', 'واحده'],
  2: ['اثنان', 'اثنين', 'اثنتان', 'اثنتين', 'اثنا', 'اثني', 'اثنتا', 'اثنتي', 'ثنتان', 'ثنتين'],
  3: ['ثلاث', 'ثلاثه', 'ثلاثا'],
  4: ['اربع', 'اربعه', 'اربعا'],
  5: ['خمس', 'خمسه', 'خمسا'],
  6: ['ست', 'سته', 'ستا'],
  7: ['سبع', 'سبعه', 'سبعا'],
  8: ['ثمان', 'ثماني', 'ثمانيه', 'ثمانيا'],
  9: ['تسع', 'تسعه', 'تسعا'],
};
const TEN_WORDS: Record<number, string[]> = {
  20: ['عشرون', 'عشرين'], 30: ['ثلاثون', 'ثلاثين'], 40: ['اربعون', 'اربعين'],
  50: ['خمسون', 'خمسين'], 60: ['ستون', 'ستين'], 70: ['سبعون', 'سبعين'],
  80: ['ثمانون', 'ثمانين'], 90: ['تسعون', 'تسعين'],
};
const WORDS = new Map<string, Piece>();
for (const [value, words] of Object.entries(UNIT_WORDS)) words.forEach((w) => WORDS.set(w, { slot: 'unit', value: Number(value) }));
for (const [value, words] of Object.entries(TEN_WORDS)) words.forEach((w) => WORDS.set(w, { slot: 'ten', value: Number(value) }));
['عشر', 'عشره'].forEach((w) => WORDS.set(w, { slot: 'teen', value: 10 }));
['مائتان', 'مائتين', 'مئتان', 'مئتين'].forEach((w) => WORDS.set(w, { slot: 'hundred', value: 200 }));
['مائه', 'مئه', 'مايه'].forEach((w) => WORDS.set(w, { slot: 'hundred', value: 100, bare: true }));

const HUNDRED_STEMS: Record<string, number> = { ثلاث: 3, اربع: 4, خمس: 5, ست: 6, سبع: 7, ثمان: 8, تسع: 9 };
const UNSUPPORTED = new Set(['الف', 'الفا', 'الفين', 'الاف', 'مليون', 'ملايين']);
const QUALIFIERS = new Set([
  'بضع', 'بضعه', 'نيف', 'نحو', 'قريبا', 'تقريبا', 'نصف', 'نصفا', 'ربع', 'ثلث', 'مئين', 'مئات',
  'اشهر', 'شهر', 'شهرين', 'اشهرا', 'ايام', 'اياما', 'يوما', 'يومين',
]);
const qualified = (word: string) => QUALIFIERS.has(word) || QUALIFIERS.has(word.replace(/^[وب]/, ''));

function lookup(word: string): Piece | undefined {
  const known = WORDS.get(word);
  if (known) return known;
  if (/^\d+$/.test(word)) return { slot: 'digits', value: Number(word) };
  const fused = /^(.+?)(مائه|مئه|مايه)$/.exec(word);
  return fused && fused[1] in HUNDRED_STEMS ? { slot: 'hundred', value: HUNDRED_STEMS[fused[1]] * 100 } : undefined;
}

function pieceOf(word: string): Piece | undefined {
  const known = lookup(word);
  if (known) return known;
  const bare = word.startsWith('و') ? lookup(word.slice(1)) : undefined;
  return bare && { ...bare, bare: false };
}

function pieces(words: string[]) {
  return words.map((word, i) => {
    if (word === 'احد' || word === 'احدي') {
      const next = words[i + 1];
      return next !== undefined && pieceOf(next) ? ({ slot: 'unit', value: 1 } as Piece) : undefined;
    }
    return pieceOf(word);
  });
}

function total(phrase: Piece[]): number | undefined {
  const merged: Piece[] = [];
  for (const p of phrase) {
    const before = merged[merged.length - 1];
    if (p.bare && before?.slot === 'unit' && before.value >= 3) merged.splice(-1, 1, { slot: 'hundred', value: before.value * 100 });
    else merged.push(p);
  }
  if (merged.some((p) => p.slot === 'digits')) return merged.length === 1 ? merged[0].value : undefined;
  const count = (slot: Slot) => merged.filter((p) => p.slot === slot).length;
  if (count('hundred') > 1 || count('unit') > 1 || count('teen') > 1 || count('ten') > 1) return undefined;
  if (count('ten') > 0 && count('teen') > 0) return undefined;
  const at = (slot: Slot) => merged.findIndex((p) => p.slot === slot);
  if (at('unit') >= 0 && ((at('teen') >= 0 && at('teen') < at('unit')) || (at('ten') >= 0 && at('ten') < at('unit')))) return undefined;
  return merged.reduce((sum, p) => sum + p.value, 0);
}

export function readNumber(text: string): number | undefined {
  const words = tokens(text);
  if (/[0-9]/.test(text) && /[٠-٩]/.test(text)) return undefined;
  if (words.some((w) => qualified(w) || UNSUPPORTED.has(w))) return undefined;
  const found: Piece[][] = [];
  let current: Piece[] = [];
  pieces(words).forEach((piece, i) => {
    if (piece) current.push(piece);
    else if (words[i] !== 'و' && current.length > 0) {
      found.push(current);
      current = [];
    }
  });
  if (current.length > 0) found.push(current);
  return found.length === 1 ? total(found[0]) : undefined;
}

export function readYear(text: string): number | undefined {
  const words = tokens(text);
  const at = words.findIndex((w, i) => w === 'قبل' && words[i + 1] === 'الهجره');
  if (at >= 0) {
    const rest = words.slice(at + 2).map((w) => w.replace(/^ب/, ''));
    if (rest.some(qualified)) return undefined;
    const n = readNumber(rest.join(' '));
    if (n !== undefined) return -n;
    const years = rest.filter((w) => w === 'سنه' || w === 'عام');
    const pairs = rest.filter((w) => w === 'سنتين' || w === 'عامين');
    if (years.length + pairs.length !== 1) return undefined;
    return pairs.length === 1 ? -2 : -1;
  }
  return words.some((w) => w === 'قبل' || w === 'بعد') ? undefined : readNumber(text);
}

const MONTHS: [string, number][] = [
  ['محرم', 1], ['صفر', 2], ['ربيع الاول', 3], ['ربيع (الاخر|الثاني)', 4],
  ['جمادي الاولي', 5], ['جمادي (الاخره|الثانيه)', 6], ['رجب', 7], ['شعبان', 8],
  ['رمضان', 9], ['شوال', 10], ['ذو القعده', 11], ['ذو الحجه', 12],
];
const MONTH_LEFTOVER = /(^| )[وبلفك]?(ال)?(اول|اخر|ثاني|اخره|ثانيه|اولي)( |$)/;

const monthText = (text: string) => tokens(text).join(' ').replace(/ذي (القعده|الحجه)/g, 'ذو $1');
const monthPattern = (name: string) => new RegExp(`(^| )(لل|[وبلفك]?(ال)?)${name}( |$)`);

export function readMonth(text: string): number | undefined {
  const joined = monthText(text);
  const hits = MONTHS.filter(([name]) => monthPattern(name).test(joined));
  if (hits.length !== 1) return undefined;
  const rest = joined.replace(monthPattern(hits[0][0]), ' ');
  return MONTH_LEFTOVER.test(rest) ? undefined : hits[0][1];
}

const ORDINALS: Record<string, number> = {
  الاول: 1, الحادي: 1, الثاني: 2, الثالث: 3, الرابع: 4, الخامس: 5, السادس: 6,
  السابع: 7, الثامن: 8, التاسع: 9, العاشر: 10,
};
const ORDINAL_UNITS = 'الحادي|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع';
const NOT_A_DAY = new Set(['خلون', 'خلت', 'بقين', 'بقيت', 'النصف', 'مستهل', 'اول', 'اخر', 'اواخر', 'اوائل']);

export function readDay(text: string): number | undefined {
  const words = tokens(text);
  if (words.some((w) => NOT_A_DAY.has(w))) return undefined;
  let joined = monthText(text);
  for (const [name] of MONTHS) joined = joined.replace(monthPattern(name), ' ');
  const digits = words.filter((w) => /^\d+$/.test(w));
  if (digits.length === 1) return Number(digits[0]) >= 1 && Number(digits[0]) <= 30 ? Number(digits[0]) : undefined;
  if (digits.length > 1) return undefined;
  if (new RegExp(`(${ORDINAL_UNITS}) و?الثلاثين`).test(joined)) return undefined;
  const readings = new Set<number>();
  let used = 1;
  if (/(^| )و?الثلاثين( |$)/.test(joined)) readings.add(30);
  const twenties = new RegExp(`(${ORDINAL_UNITS}) و?العشرين`).exec(joined);
  if (twenties) {
    readings.add(20 + ORDINALS[twenties[1]]);
    used = 2;
  } else if (/(^| )العشرين( |$)/.test(joined)) readings.add(20);
  const teens = new RegExp(`(${ORDINAL_UNITS}) عشر`).exec(joined);
  if (teens) {
    readings.add(10 + ORDINALS[teens[1]]);
    used = 2;
  }
  if (readings.size === 0) {
    const ordinals = joined.split(' ').filter((w) => w in ORDINALS);
    if (ordinals.length === 1) readings.add(ORDINALS[ordinals[0]]);
  }
  const numeric = joined
    .split(' ')
    .map((w) => w.replace(/^[وبلفك]/, ''))
    .filter((w) => w in ORDINALS || w === 'عشر' || /^(العشرين|الثلاثين)$/.test(w)).length;
  return readings.size === 1 && numeric === used ? [...readings][0] : undefined;
}

export const dateReaders: Partial<Record<Predicate, (text: string) => number | undefined>> = {
  'born.year': readYear,
  'died.year': readYear,
  'islam.age': readNumber,
  'born.month': readMonth,
  'died.month': readMonth,
  'born.day': readDay,
  'died.day': readDay,
};

export const dateParts: Partial<Record<Predicate, Predicate>> = {
  'died.day': 'died.month',
  'died.month': 'died.year',
  'born.day': 'born.month',
  'born.month': 'born.year',
};

const DATE_WORDS = new Set(['سنه', 'عام', 'سنين', 'سنتين', 'عامين']);

export function dateTag(text: string): string | undefined {
  const words = tokens(text);
  const joined = monthText(text);
  const hasMonth = MONTHS.some(([name]) => monthPattern(name).test(joined));
  const hasNumber = pieces(words).some(Boolean);
  const age = words.includes('ابن') && hasNumber;
  if (!hasMonth && !age && !(words.some((w) => DATE_WORDS.has(w)) && hasNumber)) return undefined;
  const reads = readMonth(text) !== undefined || readNumber(text) !== undefined;
  const unreadable = words.some((w) => NOT_A_DAY.has(w) || qualified(w));
  return reads && !unreadable ? 'time-layer:waiting' : 'time-layer:unreadable';
}
