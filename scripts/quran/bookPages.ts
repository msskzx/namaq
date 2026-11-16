// docs/plans/book-reader.md: where each printed page starts inside a book's passages. The builders cut a book at its
// own headings and tidy the text, so a page break is found again by its letters: the first letters of each printed
// page, looked for in the passages' letters after the page before it.

/** One printed page as the dump gives it, cleaned the way its book's builder cleans it. */
export type RawPage = { part: number; page: number; text: string };
/** [passage, offset in its text, part, page]: the page starts there. */
export type PageBreak = [number, number, number, number];

const letters = (text: string) => text.replace(/[ىی]/g, 'ي').replace(/ة/g, 'ه').replace(/[أإآٱ]/g, 'ا').replace(/[^ء-غف-ي]/g, '');

const KEY = 24;
const SHIFTS = 30;
// How far past the page before a page may start: what the builder dropped between them (footnotes, a heading, the
// pages it found no place for) is a few pages at most (al-Sa'di's dump lacks some pieces, filled from Shamela).
const SLACK = 20_000;

/**
 * The page breaks of a book whose passages run in page order. A page whose first letters the builder dropped (a
 * heading, a volume's title) starts at the first of its letters found; a page none of whose letters are found
 * (dropped whole) has no break and joins the page before. Breaks fall at the start of a word.
 */
export function pageBreaks(texts: string[], pages: RawPage[]): { breaks: PageBreak[]; lost: RawPage[] } {
  const where: [number, number][] = [];
  let stream = '';
  texts.forEach((text, passage) => {
    for (let at = 0; at < text.length; at++) {
      const letter = letters(text[at]);
      if (!letter) continue;
      stream += letter;
      where.push([passage, at]);
    }
  });
  const breaks: PageBreak[] = [];
  const lost: RawPage[] = [];
  let cursor = 0;
  let reach = SLACK;
  for (const page of pages) {
    const own = letters(page.text);
    reach += 2 * own.length;
    let found = -1;
    for (let shift = 0; shift < SHIFTS && found < 0 && shift * KEY + KEY <= own.length; shift++) {
      const key = own.slice(shift * KEY, shift * KEY + KEY);
      const at = stream.indexOf(key, cursor);
      if (at < 0 || at - cursor > reach) continue;
      let start = at;
      for (let back = shift * KEY - 1; back >= 0 && start > cursor && stream[start - 1] === own[back]; back--) start--;
      found = start;
    }
    if (found < 0) { lost.push(page); continue; }
    cursor = found + 1;
    reach = SLACK;
    const [passage, offset] = where[found];
    const text = texts[passage];
    let start = offset;
    while (start > 0 && !/\s/.test(text[start - 1])) start--;
    const previous = breaks.at(-1);
    if (previous && previous[0] === passage && previous[1] >= start) { lost.push(page); continue; }
    breaks.push([passage, start, page.part, page.page]);
  }
  return { breaks, lost };
}
