export interface ExtractedParagraph {
  anchor: string;
  text: string;
}

export interface ExtractedPage {
  printedPage: string | null;
  body: ExtractedParagraph[];
  notes: string[];
}

/**
 * Reads one Shamela reading page. Its markup puts the work's text in `.nass`
 * as anchored paragraphs, then a rule, then the edition's footnotes in
 * `p.hamesh` — the split that keeps author and editor separately attributable.
 */
export function extractShamelaPage(document: Document): ExtractedPage {
  const nass = document.querySelector('.nass');
  if (!nass) throw new Error('no .nass element: the page layout has changed');

  nass.querySelectorAll('a.btn_tag').forEach((node) => node.remove());

  const printedPage = (document.title.match(/ص(\d+)/) ?? [])[1] ?? null;
  const body: ExtractedParagraph[] = [];
  const notes: string[] = [];
  let afterRule = false;

  for (const child of Array.from(nass.children)) {
    if (child.tagName === 'HR') {
      afterRule = true;
      continue;
    }

    const text = (child.textContent ?? '').replace(/\s+/g, ' ').trim();
    if (!text) continue;

    if (afterRule || child.classList.contains('hamesh')) {
      notes.push(text);
    } else {
      body.push({ anchor: child.querySelector('.anchor')?.id ?? `p${body.length + 1}`, text });
    }
  }

  return { printedPage, body, notes };
}

export interface EntryBounds {
  startAnchor?: string;
  endAnchor?: string;
  /** Text that begins the next entry's notes; everything from it is dropped. */
  notesEndMarker?: string;
}

/**
 * Keeps only this subject's segment of a page. Both ends are inclusive and
 * either may be omitted, because only the first and last page of an entry are
 * ever shared with neighbouring entries or with volume front matter. A shared
 * page's notes run together in one block, so they are trimmed by marker text
 * rather than by anchor.
 */
export function sliceEntry(page: ExtractedPage, bounds: EntryBounds = {}): ExtractedPage {
  const { startAnchor, endAnchor, notesEndMarker } = bounds;
  const start = startAnchor ? page.body.findIndex((p) => p.anchor === startAnchor) : 0;
  const end = endAnchor ? page.body.findIndex((p) => p.anchor === endAnchor) : page.body.length - 1;

  if (start < 0) throw new Error(`start anchor "${startAnchor}" is not on this page`);
  if (end < 0) throw new Error(`end anchor "${endAnchor}" is not on this page`);

  const notes = notesEndMarker
    ? page.notes
        .map((note) => (note.includes(notesEndMarker) ? note.slice(0, note.indexOf(notesEndMarker)).trim() : note))
        .filter(Boolean)
    : page.notes;

  return { ...page, body: page.body.slice(start, end + 1), notes };
}

/** The work's own text for this page, one paragraph per block. */
export function bodyMarkdown(page: ExtractedPage): string {
  return `${page.body.map((paragraph) => paragraph.text).join('\n\n')}\n`;
}

/** The edition's footnotes, kept in their own file so their author stays clear. */
export function notesMarkdown(page: ExtractedPage): string | null {
  return page.notes.length === 0 ? null : `${page.notes.join('\n\n')}\n`;
}
