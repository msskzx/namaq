import type { AppCite } from '../battles/battle';
import type { Citation } from '../quran/mutashabih/types';
import { num } from '../quran/arabicNumber';
import { SURAH_NAMES } from '../quran/surahNames';

export type QuizSource = { book: string; author?: string; at?: string; quote?: string; by?: string; url?: string; edition?: string };

export const ayahPlace = (key: string) => {
  const [surah, ayah] = key.split(':').map(Number);
  return `${SURAH_NAMES[surah]} ${num(ayah)}`;
};

export const MUSHAF_BOOK = 'مصحف المدينة برواية حفص';

export const mushafSource = (key: string, page?: number): QuizSource => ({
  book: MUSHAF_BOOK,
  at: page ? `${ayahPlace(key)}، ص ${num(page)}` : ayahPlace(key),
});

export function citeSource(ref: AppCite): QuizSource {
  const at = ref.cite.indexOf('، ');
  return {
    book: at < 0 ? ref.cite : ref.cite.slice(0, at),
    ...(at >= 0 && { at: ref.cite.slice(at + 2) }),
    ...(ref.text && { quote: ref.text }),
    ...(ref.url && { url: ref.url }),
  };
}

export function uniqueSources(sources: QuizSource[]): QuizSource[] {
  const seen = new Set<string>();
  return sources.filter(source => {
    const id = JSON.stringify([source.book, source.at, source.quote]);
    return !seen.has(id) && !!seen.add(id);
  });
}

const digits = (text: string) => text.replace(/\d/g, digit => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]);

const MUTASHABIH_SHORT: Record<string, string> = { K: 'أسرار التكرار', I: 'درة التنزيل', G: 'ملاك التأويل', Z: 'البرهان في علوم القرآن' };

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

export type ReferenceLine = { text: string; cite?: string; url?: string };

export const MUSHAF_LINE = 'المصحف';

export function referenceGroups(sources: QuizSource[]): { title: string; lines: ReferenceLine[]; places: string[]; editions: string[] }[] {
  const groups = new Map<string, ReferenceLine[]>();
  const placesOf = new Map<string, string[]>();
  const mushaf = sources.filter(source => source.book === MUSHAF_BOOK);
  if (mushaf.length) {
    const places = [...new Set(mushaf.flatMap(source => (source.at ? [source.at.split('، ص ')[0]] : [])))].join('، ');
    const title = places ? `${MUSHAF_LINE} · ${places}` : MUSHAF_LINE;
    groups.set(title, [{ text: MUSHAF_BOOK }, ...mushaf.flatMap(source => (source.at ? [{ text: source.at }] : []))]);
    const pages = [...new Set(mushaf.flatMap(source => (source.at?.includes('، ص ') ? [`ص ${source.at.split('، ص ')[1]}`] : [])))];
    placesOf.set(title, [MUSHAF_BOOK, ...pages]);
  }
  const editions = new Map<string, string[]>();
  for (const source of sources) {
    if (source.book === MUSHAF_BOOK) continue;
    const title = source.author ? `${source.book} · ${source.author}` : source.book;
    const at = source.at ?? '';
    const lines = groups.get(title) ?? [];
    const cited = placesOf.get(title) ?? [];
    if (at && !cited.includes(at)) cited.push(at);
    placesOf.set(title, cited);
    if (source.by) lines.push({ text: source.by });
    if (source.url) lines.push({ text: source.quote ?? '', cite: at, url: source.url });
    else lines.push({ text: source.quote ? `«${source.quote}»${at ? `، ${at}` : ''}` : at });
    groups.set(title, lines);
    const printed = editions.get(title) ?? [];
    if (source.edition && !printed.includes(source.edition)) editions.set(title, [...printed, source.edition]);
  }
  return [...groups].map(([title, lines]) => ({
    title, places: placesOf.get(title) ?? [], editions: editions.get(title) ?? [],
    lines: [...lines, ...(editions.get(title) ?? []).map((text): ReferenceLine => ({ text }))].filter(line => line.text || line.url),
  }));
}

export type SourceEntry = { line: string; quotes: ReferenceLine[]; links?: { label: string; url: string }[];
  places?: string[];
  editions?: string[] };

export function mergeSources<T extends SourceEntry>(sources: T[]): SourceEntry[] {
  const books = new Map<string, SourceEntry>();
  for (const source of sources) {
    const was = books.get(source.line);
    if (!was) {
      books.set(source.line, { line: source.line, quotes: [...source.quotes], ...(source.links && { links: [...source.links] }),
        ...(source.places && { places: [...source.places] }), ...(source.editions && { editions: [...source.editions] }) });
      continue;
    }
    for (const place of source.places ?? []) if (!was.places?.includes(place)) was.places = [...(was.places ?? []), place];
    for (const edition of source.editions ?? []) if (!was.editions?.includes(edition)) was.editions = [...(was.editions ?? []), edition];
    for (const quote of source.quotes)
      if (!was.quotes.some(other => other.text === quote.text && other.cite === quote.cite && other.url === quote.url)) was.quotes.push(quote);
    for (const link of source.links ?? [])
      if (!was.links?.some(other => other.url === link.url)) was.links = [...(was.links ?? []), link];
  }
  return [...books.values()];
}

export const sourceEntries = (sources: QuizSource[]): SourceEntry[] => referenceGroups(sources).map(group => ({
  line: group.title, quotes: group.lines,
  ...(group.places.length && { places: group.places }), ...(group.editions.length && { editions: group.editions }),
}));
