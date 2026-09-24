/**
 * A page's body is stored as plain paragraphs, with a source's own section
 * headings marked the same way the batches do: a paragraph that is nothing
 * but a bracketed phrase, per data/history/batches/*\/headingSweep.test.ts.
 * This reads that same convention back out so the reader can offer a section
 * index instead of only flipping pages one at a time.
 */

export interface SectionHeading {
  /** Position within the page, in case a page carries more than one heading. */
  paragraphIndex: number;
  /** The heading's own text, brackets stripped. */
  text: string;
}

export interface PageParagraph {
  text: string;
  heading: boolean;
}

/** A whole paragraph the editor bracketed, and nothing else. */
function isHeadingParagraph(paragraph: string) {
  return paragraph.startsWith('[') && paragraph.endsWith(']');
}

function stripBrackets(paragraph: string) {
  return paragraph.replace(/^\[+/, '').replace(/\]+$/, '').replace(/:\s*$/, '').trim();
}

/** Every section heading a page's body declares, in reading order. */
export function pageHeadings(bodyMarkdown: string): SectionHeading[] {
  return pageParagraphs(bodyMarkdown)
    .flatMap(({ text, heading }, paragraphIndex) => heading && text.length > 0 ? [{ paragraphIndex, text }] : []);
}

/** Paragraphs ready for the reader, with the batch heading convention identified. */
export function pageParagraphs(bodyMarkdown: string): PageParagraph[] {
  return bodyMarkdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((text) => ({ text: isHeadingParagraph(text) ? stripBrackets(text) : text, heading: isHeadingParagraph(text) }))
    .filter(({ text }) => text.length > 0);
}
