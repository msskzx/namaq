import { num } from './arabicNumber';
import { ITQAN_BOOK, ITQAN_EDITION, itqanCredit, itqanPage, type ItqanData } from './itqanBalagha';
import type { QuizSource } from '../quiz/sources';

/**
 * The balagha terms page «مصطلحات البلاغة» (owner, 2026-11-18): every device al-Suyuti names in al-Itqan's chapters on
 * balagha (kinds 52 to 58) that the balagha cards and quizzes use, each with his own definition quoted whole, and every
 * paragraph of his under it that quotes an ayah. Where he gives no definition, al-Qazwini's words in Talkhis al-Miftah
 * stand in (owner's pick, 2026-11-18), and a heading with neither shows al-Suyuti's opening words under it. Built by
 * scripts/quran/buildBalaghaTerms.ts from scripts/quran/balaghaTermDefinitions.json.
 */

/** Print slips in his headings, and the name a reader knows a heading by. */
const RENAMED: Record<string, string> = { 'فِي أَنْوَاعِ الْحَذْفِ': 'الْحَذْفُ', 'الإطناب الزيادة': 'الإطناب بالزيادة', 'الافتان': 'الافتنان' };
/** A heading that does not say what the device is to a reader («الْأَعْلَامُ» reads as names or flags). */
const UNCLEAR = new Set(['الْأَعْلَامُ']);
/** Chapters whose paragraphs stand under no heading of his: the chapter's own subject is the device. */
const CHAPTER: Record<number, string> = { 52: 'الْمَجَازُ', 53: 'التَّشْبِيهُ وَالِاسْتِعَارَةُ', 54: 'الْكِنَايَةُ وَالتَّعْرِيضُ', 55: 'الْحَصْرُ وَالِاخْتِصَاصُ' };

/**
 * Terms that hold others, so never offered as a wrong choice: a metaphor is a مجاز, a تذييل is a إطناب بالزيادة. The
 * balagha quiz's bank (buildAyahQuizzes) avoids the first six; «ما المصطلح؟» avoids all.
 */
export const BROAD_TERMS = ['الْمَجَازُ', 'التَّشْبِيهُ وَالِاسْتِعَارَةُ', 'الْكِنَايَةُ وَالتَّعْرِيضُ', 'الْحَصْرُ وَالِاخْتِصَاصُ', 'الْحَذْفُ', 'إيجاز الحذف'];
/** al-Suyuti's two kinds of الإطناب (kind 56), each holding the devices he lists under it. */
export const BROAD_ITNAB = ['الإطناب بالزيادة', 'الإطناب بالبسط'];

/** The term a paragraph of his (its kind and heading) falls under, or null when it names none. */
export function termOf(kind: number, heading: string): string | null {
  if (UNCLEAR.has(heading)) return null;
  return heading ? RENAMED[heading] ?? heading : CHAPTER[kind] ?? null;
}

/** The term a paragraph of the reader's sheet (itqanAt: its chapter's title and his heading) falls under. */
export function termOfParagraph(itqan: ItqanData, paragraph: { kind: string; heading: string }): string | null {
  const kind = Number(Object.keys(itqan.kinds).find(at => itqan.kinds[Number(at)] === paragraph.kind));
  return kind ? termOf(kind, paragraph.heading) : null;
}

/** A quote that defines a term: its book, volume, first and last page, Shamela page id and text. */
export type TermQuote = { book: 'itqan' | 'talkhis'; part: number; pages: [number, number]; id: number; text: string };
/** A term: its name (his heading, vocalized as in the book), its chapter (kind 52 to 58), whether its quotes define it, and the quotes. */
export type BalaghaTerm = { name: string; kind: number; defines: boolean; quotes: TermQuote[] };
export type BalaghaTermsData = { terms: BalaghaTerm[] };

/** The name without its marks, for lists, choices and search. */
export const plainName = (name: string) => name.replace(/[ً-ٰٟ]/g, '');

const TALKHIS_SHORT = 'تلخيص المفتاح للقزويني';
const TALKHIS_EDITION = 'تلخيص المفتاح لجلال الدين القزويني (ت ٧٣٩هـ)، متنًا فوق شرح بهاء الدين السبكي «عروس الأفراح في شرح تلخيص المفتاح»، تحقيق عبد الحميد هنداوي، المكتبة العصرية، ١٤٢٣هـ/٢٠٠٣م';
/** Each book's printing, and how its words were taken, as the credit under a quote says it. */
const TERM_EDITION: Record<TermQuote['book'], string> = {
  itqan: `${ITQAN_BOOK}، ${ITQAN_EDITION}. النص من نسخة المكتبة الشاملة التي نشرها موقع تراث، الفقرة كاملة كما في الكتاب.`,
  talkhis: `${TALKHIS_EDITION}. كلام القزويني في أعلى الصفحة، من نسخة المكتبة الشاملة التي نشرها موقع تراث. لم يعرّفه السيوطي في الإتقان، فنقلنا تعريف القزويني.`,
};
/** The line under a quote: book, volume and page. 'Arus al-Afrah prints the Talkhis above al-Subki's commentary. */
export const termCredit = (quote: TermQuote) => quote.book === 'itqan'
  ? itqanCredit(quote)
  : `${TALKHIS_SHORT}، في عروس الأفراح ${num(quote.part)}/${num(quote.pages[0])}${quote.pages[1] !== quote.pages[0] ? `–${num(quote.pages[1])}` : ''}`;
/** A quote as a quiz source (shared/quiz/sources.ts): its book and author, volume and pages, and its page online. */
export const termSource = (quote: TermQuote): QuizSource => {
  const at = `${num(quote.part)}/${num(quote.pages[0])}${quote.pages[1] !== quote.pages[0] ? `–${num(quote.pages[1])}` : ''}`;
  return quote.book === 'itqan'
    ? { book: ITQAN_BOOK, author: 'السيوطي', at, url: termPage(quote), edition: TERM_EDITION.itqan }
    : { book: 'تلخيص المفتاح', author: 'القزويني', at: `في عروس الأفراح ${at}`, url: termPage(quote), edition: TERM_EDITION.talkhis };
};
export const termPage = (quote: TermQuote) => quote.book === 'itqan' ? itqanPage(quote) : `https://shamela.ws/book/11151/${quote.id}`;

/** An example's paragraph of al-Suyuti's as its card's source: volume and pages, the page online and the printing. */
export const exampleSource = (example: Pick<TermExample, 'part' | 'pages' | 'id'>): QuizSource => ({
  ...termSource({ book: 'itqan', part: example.part, pages: example.pages, id: example.id, text: '' }),
  edition: `${ITQAN_BOOK}، ${ITQAN_EDITION}. الفقرة كاملة كما في الكتاب، تحت عنوانه.`,
});

/** His chapter's title without its marks («النوع الثامن والخمسون: في بدائع القرآن»). */
export const chapterTitle = (itqan: ItqanData, kind: number) => plainName(itqan.kinds[kind] ?? '');

/** An example: one paragraph of his under the term that quotes an ayah, and the ayat he surely names in it («2:255»), in order. */
export type TermExample = { entry: number; text: string; part: number; pages: [number, number]; id: number; ayat: string[] };

const examples = new WeakMap<ItqanData, Map<string, TermExample[]>>();

/** Every paragraph of his under a term that quotes an ayah, in the book's order. A quote that fits several places counts only where he names the ayah. */
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

/** A term's examples on its page and card, each marked when its paragraph is already quoted whole as the definition (so the page shows its ayat without the text again). */
export const examplesOf = (itqan: ItqanData, term: Pick<BalaghaTerm, 'name' | 'quotes'>): (TermExample & { inDefinition: boolean })[] =>
  termExamples(itqan, term.name).map(example => ({ ...example, inDefinition: term.quotes.some(quote => quote.text === example.text) }));

/** The words of an example he quotes in one ayah, as runs of mushaf words [first, last]. */
export function exampleWords(itqan: ItqanData, example: Pick<TermExample, 'entry'>, key: string): [number, number][] {
  const runs: [number, number][] = [];
  for (const [, , from, to] of itqan.entries[example.entry][7].filter(([surah, ayah]) => `${surah}:${ayah}` === key).sort((a, b) => a[2] - b[2])) {
    const run = runs.at(-1);
    if (run && from <= run[1] + 1) run[1] = Math.max(run[1], to);
    else runs.push([from, to]);
  }
  return runs;
}

/** The terms by chapter, in the book's order: [kind, terms]. */
export function termsByChapter(data: BalaghaTermsData): [number, BalaghaTerm[]][] {
  const chapters = new Map<number, BalaghaTerm[]>();
  for (const term of data.terms) chapters.set(term.kind, [...(chapters.get(term.kind) ?? []), term]);
  return [...chapters];
}

/** The terms whose name, without marks, holds the search. */
export const searchTerms = (data: BalaghaTermsData, query: string) => {
  const plain = plainName(query).trim();
  return plain ? data.terms.filter(term => plainName(term.name).includes(plain)) : data.terms;
};

/** The term named, by its vocalized or plain name. */
export const termNamed = (data: BalaghaTermsData, name: string) => data.terms.find(term => term.name === name || plainName(term.name) === plainName(name));
