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
  /** Text that begins this entry's notes; everything before it is dropped. */
  notesStartMarker?: string;
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
  const { startAnchor, endAnchor, notesStartMarker, notesEndMarker } = bounds;
  const start = startAnchor ? page.body.findIndex((p) => p.anchor === startAnchor) : 0;
  const end = endAnchor ? page.body.findIndex((p) => p.anchor === endAnchor) : page.body.length - 1;

  if (start < 0) throw new Error(`start anchor "${startAnchor}" is not on this page`);
  if (end < 0) throw new Error(`end anchor "${endAnchor}" is not on this page`);

  const notes = trimNotes(trimNotes(page.notes, notesStartMarker, 'before'), notesEndMarker, 'from');

  return { ...page, body: page.body.slice(start, end + 1), notes };
}

/** Both ends of a shared block are cut the same way, from opposite sides of the marker. */
function trimNotes(notes: string[], marker: string | undefined, side: 'before' | 'from') {
  if (!marker) return notes;
  const carrying = notes.findIndex((note) => note.includes(marker));
  if (carrying < 0) return notes;

  const note = notes[carrying];
  const at = note.indexOf(marker);
  const kept = side === 'before' ? note.slice(at).trim() : note.slice(0, at).trim();
  const rest = side === 'before' ? notes.slice(carrying + 1) : notes.slice(0, carrying);

  return (side === 'before' ? [kept, ...rest] : [...rest, kept]).filter(Boolean);
}

/** The work's own text for this page, one paragraph per block. */
export function bodyMarkdown(page: ExtractedPage): string {
  return `${page.body.map((paragraph) => paragraph.text).join('\n\n')}\n`;
}

/** The edition's footnotes, kept in their own file so their author stays clear. */
export function notesMarkdown(page: ExtractedPage): string | null {
  return page.notes.length === 0 ? null : `${page.notes.join('\n\n')}\n`;
}

/**
 * Where a passage sits, as citations name it. Printed page alone identifies a
 * passage only while an account stays inside one volume; the Prophet's sira
 * crosses from volume 1 to volume 2 and its printed numbering restarts at 5,
 * so a volume-spanning account qualifies the anchor with the volume.
 */
export function passageAnchor(volume: number | undefined, printedPage: string, paragraph: string): string {
  return volume === undefined ? `${printedPage}-${paragraph}` : `${volume}/${printedPage}-${paragraph}`;
}
