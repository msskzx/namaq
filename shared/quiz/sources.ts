// Where a quiz question's answer comes from (owner, 2026-11-19: every quiz shows its references after answering). Each
// kind fills `sources` on its questions; the app and the website draw them with one component (QuizSources), collapsed to
// the book's name, a tap opening where in it and its words.
import type { AppCite } from '../battles/battle';
import type { Citation } from '../quran/mutashabih/types';
import { num } from '../quran/arabicNumber';
import { SURAH_NAMES } from '../quran/surahNames';

/**
 * One book a question's answer stands on. A fact from two books cites both (owner: cite every source for a fact).
 * - `book`: its name, the line shown before a tap.
 * - `author`: beside the name, where the name alone does not say whose it is.
 * - `at`: where in it: a page, a volume and page, a hadith's number, an ayah («الطور ١٧»).
 * - `quote`: the book's own words, shown once opened; `by`: who says them in it, when not the author.
 * - `url`: the book's page online.
 */
export type QuizSource = { book: string; author?: string; at?: string; quote?: string; by?: string; url?: string };

/** «الطور ١٧»: an ayah's place, the surah's name then the ayah (owner, 2026-11-19). */
export const ayahPlace = (key: string) => {
  const [surah, ayah] = key.split(':').map(Number);
  return `${SURAH_NAMES[surah]} ${num(ayah)}`;
};

export const MUSHAF_BOOK = 'مصحف المدينة برواية حفص';

/** The Madina mushaf's ayah: the source of what is asked from memory (which surah, recite, compare's wording). */
export const mushafSource = (key: string, page?: number): QuizSource => ({
  book: MUSHAF_BOOK,
  at: page ? `${ayahPlace(key)}، ص ${num(page)}` : ayahPlace(key),
});

/** A sira or battle reference as its data writes it («سير أعلام النبلاء، السيرة ١، ص ٢٩٧»): the book before the first «، ». */
export function citeSource(ref: AppCite): QuizSource {
  const at = ref.cite.indexOf('، ');
  return {
    book: at < 0 ? ref.cite : ref.cite.slice(0, at),
    ...(at >= 0 && { at: ref.cite.slice(at + 2) }),
    ...(ref.text && { quote: ref.text }),
    ...(ref.url && { url: ref.url }),
  };
}

/** The sources of several references, a reference repeated (the same book, place and words) given once. */
export function uniqueSources(sources: QuizSource[]): QuizSource[] {
  const seen = new Set<string>();
  return sources.filter(source => {
    const id = JSON.stringify([source.book, source.at, source.quote]);
    return !seen.has(id) && !!seen.add(id);
  });
}

const digits = (text: string) => text.replace(/\d/g, digit => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]);

/** The short names of the mutashabih books, by the letter their citations' ids start with (their full titles are long). */
const MUTASHABIH_SHORT: Record<string, string> = { K: 'أسرار التكرار', I: 'درة التنزيل', G: 'ملاك التأويل', Z: 'البرهان في علوم القرآن' };

/** A mutashabih book's entry on a pair of ayat (shared/quran/mutashabih/types.ts Citation): «الكرماني، أسرار التكرار في القرآن». */
export function citationSource(citation: Pick<Citation, 'id' | 'book' | 'locator' | 'quote' | 'url'>): QuizSource {
  const comma = citation.book.indexOf('، ');
  const title = comma < 0 ? citation.book : citation.book.slice(comma + 2);
  return {
    book: MUTASHABIH_SHORT[citation.id[0]] ?? title,
    ...(comma >= 0 && { author: citation.book.slice(0, comma) }),
    at: digits(citation.locator.replace(/^§\s*/, '')),
    quote: citation.quote,
    url: citation.url,
  };
}

/** A line of an opened reference, as both Reference components draw it: the book's words with the place as a link. */
export type ReferenceLine = { text: string; cite?: string; url?: string };

/** The mushaf's short name on a reference line: «المصحف · الإخلاص ٣» (owner, 2026-11-20: every card has a line, the Quran too). */
export const MUSHAF_LINE = 'المصحف';

/**
 * The references under an answer or a home card, one collapsed line for each book (owner, 2026-11-19: only the book's
 * name, maybe its author; a tap opens the rest), written «book · author» (owner, 2026-11-20). The mushaf's line names the
 * ayat instead («المصحف · الإخلاص ٣»). Opened, each place cited in it: the book's words with the place, linked where the
 * book is online, and who says them under them.
 */
export function referenceGroups(sources: QuizSource[]): { title: string; lines: ReferenceLine[] }[] {
  const groups = new Map<string, ReferenceLine[]>();
  const mushaf = sources.filter(source => source.book === MUSHAF_BOOK);
  if (mushaf.length) {
    const places = [...new Set(mushaf.flatMap(source => (source.at ? [source.at.split('، ص ')[0]] : [])))].join('، ');
    groups.set(places ? `${MUSHAF_LINE} · ${places}` : MUSHAF_LINE, [{ text: MUSHAF_BOOK }, ...mushaf.flatMap(source => (source.at ? [{ text: source.at }] : []))]);
  }
  for (const source of sources) {
    if (source.book === MUSHAF_BOOK) continue;
    const title = source.author ? `${source.book} · ${source.author}` : source.book;
    const at = source.at ?? '';
    const lines = groups.get(title) ?? [];
    if (source.url) lines.push({ text: source.quote ?? '', cite: at, url: source.url });
    else lines.push({ text: source.quote ? `«${source.quote}»${at ? `، ${at}` : ''}` : at });
    if (source.by) lines.push({ text: source.by });
    groups.set(title, lines);
  }
  return [...groups].map(([title, lines]) => ({ title, lines: lines.filter(line => line.text || line.url) }));
}
