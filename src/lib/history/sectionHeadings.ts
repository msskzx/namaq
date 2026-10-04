import { matchForm } from '../model/span';

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

/** See docs/adr/0019-a-contents-list-names-chapters-not-entries.md. */
function isNumberedEntryTitle(paragraph: string) {
  return paragraph.length < 200 && /^[٠-٩۰-۹\d]+\s*[-–—]\s*\S[^\n]*\*/.test(paragraph);
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
  const paragraphs = bodyMarkdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return paragraphs
    .map((text) => {
      const heading = isHeadingParagraph(text) || isNumberedEntryTitle(text);
      return { text: isHeadingParagraph(text) ? stripBrackets(text) : text, heading };
    })
    .filter(({ text }) => text.length > 0);
}

/**
 * Index of the rendered paragraph holding the cited excerpt, or -1 when the
 * page body cannot be matched safely and the reader should stay at the top.
 */
export function findPassageParagraph(bodyMarkdown: string, excerpt: string): number {
  const needle = matchForm(excerpt);
  if (!needle) return -1;
  return pageParagraphs(bodyMarkdown).findIndex(({ text }) => matchForm(text).includes(needle));
}
