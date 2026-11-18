import { num } from './arabicNumber';

/**
 * Balagha in the reader from al-Suyuti's al-Itqan (docs/plans/balagha.md): his paragraphs in the chapters on balagha
 * (kinds 52 to 58) that quote an ayah, each whole, under his own heading. Built by scripts/quran/buildItqanBalagha.ts.
 */

/** [surah, ayah, first word, last word, places, quote]: where a quote of the paragraph runs, mushaf words from 0. `places` is
 * how many places in the Quran the quote fits when the paragraph does not tell which one it means (1 when it does);
 * `quote` is which of the paragraph's ﴿…﴾ it is, from 0. */
export type ItqanPlace = [surah: number, ayah: number, from: number, to: number, places: number, quote: number];
/** [kind, his heading or '', volume, first page, last page, Shamela page id, text, places]; quotes in the text are ﴿…﴾. */
export type ItqanEntry = [kind: number, heading: string, part: number, first: number, last: number, id: number, text: string, places: ItqanPlace[]];
export type ItqanData = { source: { book: number; sha: string }; kinds: Record<number, string>; entries: ItqanEntry[] };

/** `words`: the runs of the ayah's words the paragraph quotes, each [first, last]. `places`: 1 when at least one of its
 * quotes here is placed for sure, otherwise how many places the quote fits. `matches`: then every ayah («2:255») his
 * quotes here fit, in the mushaf's order, for the list under the paragraph and its count; otherwise empty. */
export type ItqanParagraph = { kind: string; heading: string; part: number; pages: [number, number]; id: number; text: string; words: [number, number][]; places: number; matches: string[] };

const indexes = new WeakMap<ItqanData, Map<string, number[]>>();

/** His paragraphs that quote an ayah, in the book's order, with the ayah's words each one quotes. */
export function itqanAt(data: ItqanData, key: string): ItqanParagraph[] {
  let index = indexes.get(data);
  if (!index) {
    index = new Map();
    data.entries.forEach(([, , , , , , , places], at) => {
      for (const [surah, ayah] of places) {
        const list = index!.get(`${surah}:${ayah}`) ?? [];
        if (list.at(-1) !== at) list.push(at);
        index!.set(`${surah}:${ayah}`, list);
      }
    });
    indexes.set(data, index);
  }
  return (index.get(key) ?? []).map(at => {
    const [kind, heading, part, first, last, id, text, places] = data.entries[at];
    const here = places.filter(([surah, ayah]) => `${surah}:${ayah}` === key);
    const words: [number, number][] = [];
    for (const [, , from, to] of [...here].sort((a, b) => a[2] - b[2])) {
      const run = words.at(-1);
      if (run && from <= run[1] + 1) run[1] = Math.max(run[1], to);
      else words.push([from, to]);
    }
    const count = Math.min(...here.map(place => place[4]));
    // Only the quotes that run in this ayah: another quote of his that names no place is not about this one.
    const quotes = new Set(here.map(place => place[5]));
    const matches = count > 1 ? [...new Set(places.filter(place => quotes.has(place[5])).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(([surah, ayah]) => `${surah}:${ayah}`))] : [];
    return { kind: data.kinds[kind] ?? '', heading, part, pages: [first, last], id, text, words, places: count, matches };
  });
}

/** The short line under a paragraph: book, volume and page(s). */
export const itqanCredit = (paragraph: Pick<ItqanParagraph, 'part' | 'pages'>) =>
  `الإتقان للسيوطي ${num(paragraph.part)}/${num(paragraph.pages[0])}${paragraph.pages[1] !== paragraph.pages[0] ? `–${num(paragraph.pages[1])}` : ''}`;

/** Shamela's page of the printed book where a paragraph starts. */
export const itqanPage = (paragraph: Pick<ItqanParagraph, 'id'>) => `https://shamela.ws/book/11728/${paragraph.id}`;

export const ITQAN_BOOK = 'الإتقان في علوم القرآن';
export const ITQAN_EDITION = 'جلال الدين السيوطي (ت ٩١١هـ)، تحقيق محمد أبو الفضل إبراهيم، الهيئة المصرية العامة للكتاب، ١٣٩٤هـ/١٩٧٤م';
