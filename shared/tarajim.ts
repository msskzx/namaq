import type { QuizSource } from './quiz/sources';
import { sourceById } from './sources';


export interface PageRef {
  volume: number;
  page: string;
  work?: string;
}

export const OTHER_WORKS: Record<string, { book: string; author: string; source: string }> = {
  'zad-al-maad': { book: 'زاد المعاد', author: 'ابن القيم', source: 'zad-al-maad' },
  'sunan-al-tirmidhi': { book: 'سنن الترمذي', author: 'الترمذي', source: 'sunan-tirmidhi' },
};

export const sourcesOf = (refs: PageRef[]) => [...new Set(refs.map((ref) => (ref.work ? OTHER_WORKS[ref.work]?.source ?? ref.work : 'siyar')))];

export interface PersonFact {
  id?: string;
  text: string;
  refs: PageRef[];
  by: string[];
  legacy?: true;
  disputed?: true;
  anonymous?: true;
  value?: number | string;
  sahih?: SahihQuote[];
}

export interface SahihQuote {
  book: 'bukhari' | 'muslim';
  n: number;
  route?: string;
  isnad: string;
  words: string;
  volume: number;
  pages: number[];
  shamela: number;
}

export interface PersonLink extends PersonFact {
  slug: string;
  name: string;
  inApp: boolean;
  sex?: 'MALE' | 'FEMALE';
}

export interface PersonTitle extends PersonFact {
  title: string;
  name: string;
  shared?: true;
}

export interface AppPerson {
  slug: string;
  name: string;
  sex?: 'MALE' | 'FEMALE';
  entry: { unit: string; number?: string; volume: number; from: string; to: string; toVolume?: number };
  fullName?: PersonFact;
  otherNames?: PersonFact[];
  nameVariants: PersonFact[];
  nasab: string[];
  kunya: PersonFact[];
  laqab: PersonFact[];
  titles: PersonTitle[];
  appearance: PersonFact[];
  virtues: PersonFact[];
  islamAge: PersonFact[];
  died: { year: PersonFact[]; month: PersonFact[]; age: PersonFact[]; place: PersonFact[] };
  parents: PersonLink[];
  children: PersonLink[];
  siblings: PersonLink[];
  spouses: PersonLink[];
  cousins: PersonLink[];
  companionOf: PersonLink[];
  battles: PersonLink[];
  absentFrom: PersonLink[];
  ayat: (PersonFact & { kind: 'REVEALED_ABOUT' | 'ABOUT' })[];
}

export const TITLE_SPEAKER_AUTHOR = 'الذهبي';

export function kunyaName(text: string) {
  return text.replace(/[ً-ْٰـ]/g, '').trim().replace(/^(?:أبا|أبي|ابا|ابي)(?=\s)/u, 'أبو').replace(/^(?:ذا|ذي)(?=\s)/u, 'ذو');
}

export function sayer(fact: PersonFact) {
  return fact.by.length === 0 ? TITLE_SPEAKER_AUTHOR : fact.by.join('، ');
}

const WOMAN = /^(?:أم|امرأة)\s|\sبنت\s|^(?:عائشة|أسماء|فاطمة|حفصة|زينب|صفية|خديجة|ميمونة|سودة|جويرية|رملة|سمية)(?:\s|$)/u;

export function saidBy(fact: PersonFact) {
  if (fact.anonymous) return 'قيل:';
  if (fact.by.length === 0) return undefined;
  const names = fact.by.map(name => (name === PROPHET_NAME ? 'النبي ﷺ' : name.replace(/^(?:أبي|أبا)(?= )/u, 'أبو').replace(/^رجلا(?= )/u, 'رجل')));
  return `${WOMAN.test(names[0].replace(/[ً-ْٰـ]/g, '')) ? 'قالت' : 'قال'} ${names.join('، ')}:`;
}
const PROPHET_NAME = 'محمد ﷺ';

export function virtueGroups(facts: readonly PersonFact[]) {
  const names = facts.flatMap(fact => fact.by);
  const whole = (name: string) => names.filter(other => other.startsWith(`${name} بن `)).sort((a, b) => b.length - a.length)[0] ?? name;
  const groups: { by?: string; items: { fact: PersonFact; at: number }[] }[] = [];
  facts.forEach((fact, at) => {
    const named = { ...fact, by: fact.by.map(whole) };
    const by = saidBy(named);
    const group = groups.find(g => g.by === by) ?? groups[groups.push({ by, items: [] }) - 1];
    group.items.push({ fact: named, at });
  });
  const rank = (by?: string) => (by === undefined ? 0 : by === 'قال النبي ﷺ:' ? 1 : by === 'قيل:' ? 3 : 2);
  return groups.map((g, i) => ({ g, i })).sort((a, b) => rank(a.g.by) - rank(b.g.by) || a.i - b.i).map(({ g }) => g);
}

export const unmarked = (text: string) => text.replace(/[\u064B-\u0652\u0670\u0640]/gu, '');

export function namePieces(text: string, names: readonly string[]): { text: string; name: boolean }[] {
  const marks = '[\\u064B-\\u0652\\u0670]*';
  const bare = (name: string) => name.replace(/[\u064B-\u0652\u0670]/gu, '').trim();
  const pattern = (name: string) => [...bare(name)].map(ch => (ch === ' ' ? '\\s+' : ch.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&') + marks)).join('')
    .replace(/^أ\[\\u064B-\\u0652\\u0670\]\*ب\[\\u064B-\\u0652\\u0670\]\*[وايى]/u, `أ${marks}ب${marks}[وايى]`);
  const alts = [...new Set(names.map(bare).filter(name => name.length > 1))].sort((a, b) => b.length - a.length).map(pattern);
  if (!alts.length) return [{ text, name: false }];
  const re = new RegExp(`(?<=(?:^|[^\\p{L}])[وفبلك]?)(?:${alts.join('|')})(?![\\p{L}])`, 'gu');
  const out: { text: string; name: boolean }[] = [];
  let at = 0;
  for (const hit of text.matchAll(re)) {
    if (hit.index! > at) out.push({ text: text.slice(at, hit.index), name: false });
    out.push({ text: hit[0], name: true });
    at = hit.index! + hit[0].length;
  }
  if (at < text.length) out.push({ text: text.slice(at), name: false });
  return out;
}

export function sayerAt(fact: PersonFact) {
  return `عند ${sayer(fact).split('، ').map(name => name.replace(/^(?:أبو|أبا)(?= )/u, 'أبي')).join('، ')}`;
}

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const arabic = (value: string | number) => String(value).replace(/\d/g, (d) => ARABIC_DIGITS[Number(d)]);

export function volumeLabel(volume: number) {
  if (volume <= 2) return { book: 'السيرة النبوية', part: volume };
  if (volume === 3) return { book: 'سيرة الخلفاء الراشدين' };
  return { book: 'سير أعلام النبلاء', part: volume - 3 };
}

export function factSources(facts: PersonFact[], quotes = false): QuizSource[] {
  if (!quotes) return pageSources(facts.flatMap(fact => fact.refs));
  return facts.flatMap(fact => pageSources(fact.refs, fact.text ? { text: fact.text, by: saidBy(fact) } : undefined));
}

export function pageSources(refs: PageRef[], quote?: { text: string; by?: string }): QuizSource[] {
  const books = new Map<string, { author: string; pages: string[]; url?: string; edition?: string }>();
  for (const ref of refs) {
    const other = ref.work ? OTHER_WORKS[ref.work] : undefined;
    const { book, part } = other ? { book: other.book, part: ref.volume as number | undefined } : volumeLabel(ref.volume);
    const at = part === undefined ? arabic(ref.page) : `${arabic(part)}/${arabic(ref.page)}`;
    const online = sourceById(other?.source ?? 'siyar');
    const entry = books.get(book) ?? { author: other?.author ?? 'الذهبي', pages: [], url: online?.link.url, edition: online?.edition };
    if (!entry.pages.includes(at)) entry.pages.push(at);
    books.set(book, entry);
  }
  return [...books].map(([book, { author, pages, url, edition }]) => ({
    book, author, at: pages.join('، '), ...(url && { url }), ...(edition && { edition }),
    ...(quote?.text && { quote: quote.text }), ...(quote?.by && { by: quote.by }),
  }));
}

export function pageLabel(refs: PageRef[]) {
  const books = new Map<string, string[]>();
  for (const ref of refs) {
    const other = ref.work ? OTHER_WORKS[ref.work] : undefined;
    const { book, part } = other ? { book: other.book, part: ref.volume as number | undefined } : volumeLabel(ref.volume);
    const at = part === undefined ? arabic(ref.page) : `${arabic(part)}/${arabic(ref.page)}`;
    const list = books.get(book) ?? [];
    if (!list.includes(at)) list.push(at);
    books.set(book, list);
  }
  return [...books].map(([book, pages]) => `${book} ${pages.join('، ')}`).join('؛ ');
}

export const inAppOrder = <P extends Pick<AppPerson, 'slug' | 'entry'>>(people: readonly P[]): P[] => people.slice().sort((a, b) =>
  Number(b.slug === 'prophet-muhammad') - Number(a.slug === 'prophet-muhammad') || a.entry.volume - b.entry.volume || Number(a.entry.from) - Number(b.entry.from));

const SAHIH_SOURCE = { bukhari: 'sahih-bukhari', muslim: 'sahih-muslim' } as const;
export function sahihPlace(quote: SahihQuote) {
  const title = sourceById(SAHIH_SOURCE[quote.book])!.title.ar;
  return `${title} (${arabic(quote.n)})`;
}

export const sahihLabel = (fact: PersonFact) => `${sahihPlace(fact.sahih![0])}، وذكره غيره`;

export function sahihSources(fact: PersonFact): QuizSource[] {
  return [
    ...(fact.sahih ?? []).map((quote): QuizSource => {
      const source = sourceById(SAHIH_SOURCE[quote.book])!;
      return {
        book: source.title.ar, ...(source.author && { author: source.author.ar }),
        at: `${arabic(quote.n)}${quote.route ? `، ${quote.route}` : ''}، ج ${arabic(quote.volume)}، ص ${quote.pages.map(arabic).join('-')}`,
        url: `${source.link.url}/${quote.shamela}`, edition: source.edition,
      };
    }),
    ...pageSources(fact.refs),
  ];
}
