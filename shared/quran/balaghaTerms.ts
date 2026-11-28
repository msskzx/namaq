import { num } from './arabicNumber';
import { ITQAN_BOOK, ITQAN_EDITION, itqanCredit, itqanPage, type ItqanData } from './itqanBalagha';
import type { QuizSource } from '../quiz/sources';


const RENAMED: Record<string, string> = { 'فِي أَنْوَاعِ الْحَذْفِ': 'الْحَذْفُ', 'الإطناب الزيادة': 'الإطناب بالزيادة', 'الافتان': 'الافتنان' };
const UNCLEAR = new Set(['الْأَعْلَامُ']);
const CHAPTER: Record<number, string> = { 52: 'الْمَجَازُ', 53: 'التَّشْبِيهُ وَالِاسْتِعَارَةُ', 54: 'الْكِنَايَةُ وَالتَّعْرِيضُ', 55: 'الْحَصْرُ وَالِاخْتِصَاصُ' };

export const BROAD_TERMS = ['الْمَجَازُ', 'التَّشْبِيهُ وَالِاسْتِعَارَةُ', 'الْكِنَايَةُ وَالتَّعْرِيضُ', 'الْحَصْرُ وَالِاخْتِصَاصُ', 'الْحَذْفُ', 'إيجاز الحذف'];
export const BROAD_ITNAB = ['الإطناب بالزيادة', 'الإطناب بالبسط'];

export function termOf(kind: number, heading: string): string | null {
  if (UNCLEAR.has(heading)) return null;
  return heading ? RENAMED[heading] ?? heading : CHAPTER[kind] ?? null;
}

export function termOfParagraph(itqan: ItqanData, paragraph: { kind: string; heading: string }): string | null {
  const kind = Number(Object.keys(itqan.kinds).find(at => itqan.kinds[Number(at)] === paragraph.kind));
  return kind ? termOf(kind, paragraph.heading) : null;
}

export type TermQuote = { book: 'itqan' | 'talkhis'; part: number; pages: [number, number]; id: number; text: string };
export type BalaghaTerm = { name: string; kind: number; defines: boolean; quotes: TermQuote[] };
export type BalaghaTermsData = { terms: BalaghaTerm[] };

export const plainName = (name: string) => name.replace(/[ً-ٰٟ]/g, '');

const TALKHIS_SHORT = 'تلخيص المفتاح للقزويني';
const TALKHIS_EDITION = 'تلخيص المفتاح لجلال الدين القزويني (ت ٧٣٩هـ)، متنًا فوق شرح بهاء الدين السبكي «عروس الأفراح في شرح تلخيص المفتاح»، تحقيق عبد الحميد هنداوي، المكتبة العصرية، ١٤٢٣هـ/٢٠٠٣م';
const TERM_EDITION: Record<TermQuote['book'], string> = {
  itqan: `${ITQAN_BOOK}، ${ITQAN_EDITION}. النص من نسخة المكتبة الشاملة التي نشرها موقع تراث، الفقرة كاملة كما في الكتاب.`,
  talkhis: `${TALKHIS_EDITION}. كلام القزويني في أعلى الصفحة، من نسخة المكتبة الشاملة التي نشرها موقع تراث. لم يعرّفه السيوطي في الإتقان، فنقلنا تعريف القزويني.`,
};
export const termCredit = (quote: TermQuote) => quote.book === 'itqan'
  ? itqanCredit(quote)
  : `${TALKHIS_SHORT}، في عروس الأفراح ${num(quote.part)}/${num(quote.pages[0])}${quote.pages[1] !== quote.pages[0] ? `–${num(quote.pages[1])}` : ''}`;
export const termSource = (quote: TermQuote): QuizSource => {
  const at = `${num(quote.part)}/${num(quote.pages[0])}${quote.pages[1] !== quote.pages[0] ? `–${num(quote.pages[1])}` : ''}`;
  return quote.book === 'itqan'
    ? { book: ITQAN_BOOK, author: 'السيوطي', at, url: termPage(quote), edition: TERM_EDITION.itqan }
    : { book: 'تلخيص المفتاح', author: 'القزويني', at: `في عروس الأفراح ${at}`, url: termPage(quote), edition: TERM_EDITION.talkhis };
};
export const termPage = (quote: TermQuote) => quote.book === 'itqan' ? itqanPage(quote) : `https://shamela.ws/book/11151/${quote.id}`;

export const exampleSource = (example: Pick<TermExample, 'part' | 'pages' | 'id'>): QuizSource => ({
  ...termSource({ book: 'itqan', part: example.part, pages: example.pages, id: example.id, text: '' }),
  edition: `${ITQAN_BOOK}، ${ITQAN_EDITION}. الفقرة كاملة كما في الكتاب، تحت عنوانه.`,
});

export const chapterTitle = (itqan: ItqanData, kind: number) => plainName(itqan.kinds[kind] ?? '');

export type TermExample = { entry: number; text: string; part: number; pages: [number, number]; id: number; ayat: string[] };

const examples = new WeakMap<ItqanData, Map<string, TermExample[]>>();

export function termExamples(itqan: ItqanData, name: string): TermExample[] {
  let index = examples.get(itqan);
  if (!index) {
    index = new Map();
    itqan.entries.forEach(([kind, heading, part, first, last, id, text, places], entry) => {
      const term = termOf(kind, heading);
      if (!term) return;
      const ayat = [...new Set(places.filter(place => place[4] === 1).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(([surah, ayah]) => `${surah}:${ayah}`))];
      if (!ayat.length) return;
      const list = index!.get(term) ?? [];
      list.push({ entry, text, part, pages: [first, last], id, ayat });
      index!.set(term, list);
    });
    examples.set(itqan, index);
  }
  return index.get(name) ?? [];
}

export const examplesOf = (itqan: ItqanData, term: Pick<BalaghaTerm, 'name' | 'quotes'>): (TermExample & { inDefinition: boolean })[] =>
  termExamples(itqan, term.name).map(example => ({ ...example, inDefinition: term.quotes.some(quote => quote.text === example.text) }));

export function exampleWords(itqan: ItqanData, example: Pick<TermExample, 'entry'>, key: string): [number, number][] {
  const runs: [number, number][] = [];
  for (const [, , from, to] of itqan.entries[example.entry][7].filter(([surah, ayah]) => `${surah}:${ayah}` === key).sort((a, b) => a[2] - b[2])) {
    const run = runs.at(-1);
    if (run && from <= run[1] + 1) run[1] = Math.max(run[1], to);
    else runs.push([from, to]);
  }
  return runs;
}

export function termsByChapter(data: BalaghaTermsData): [number, BalaghaTerm[]][] {
  const chapters = new Map<number, BalaghaTerm[]>();
  for (const term of data.terms) chapters.set(term.kind, [...(chapters.get(term.kind) ?? []), term]);
  return [...chapters];
}

export const searchTerms = (data: BalaghaTermsData, query: string) => {
  const plain = plainName(query).trim();
  return plain ? data.terms.filter(term => plainName(term.name).includes(plain)) : data.terms;
};

export const termNamed = (data: BalaghaTermsData, name: string) => data.terms.find(term => term.name === name || plainName(term.name) === plainName(name));
