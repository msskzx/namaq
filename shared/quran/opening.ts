/**
 * A book's first words as a card shows them (the word page's «أصلها», the mutashabih page's «لماذا؟»): verbatim, stopped
 * where a reader can stop, never with a bracket or quotation left open.
 */

/** As long as an opening may run before it stops at a comma, so it reads in a glance. */
export const OPENING = 220;
const PAIRS: Record<string, string> = { '«': '»', '(': ')', '[': ']', '﴿': '﴾' };
const CLOSERS = new Set(Object.values(PAIRS));

/** Where a run of his words first leaves a bracket or quotation open (or closes one it never opened), or -1. */
export function unbalancedAt(text: string): number {
  const open: number[] = [];
  for (let i = 0; i < text.length; i++) {
    if (PAIRS[text[i]]) open.push(i);
    else if (CLOSERS.has(text[i])) { if (!open.length) return i; open.pop(); }
  }
  return open.length ? open[0] : -1;
}

/** The run before the last comma ahead of `at`, or nothing when there is none. */
export const beforeComma = (text: string, at: number) => { const comma = text.lastIndexOf('،', at); return comma > 0 ? text.slice(0, comma) : ''; };

/**
 * A book's first words, exactly as stored: its first line or sentence, stopped at the last comma before `max` when it runs
 * long, before `stop` when given (or right at it when no comma comes before), and before a bracket or quotation the stop would leave open. Empty when no words of its
 * own come before them.
 */
export function leading(text: string, max: number, stop?: RegExp): string {
  const line = text.search(/\n|[.؟!](\s|$)/);
  let words = line < 0 ? text : text.slice(0, line + (text[line] === '\n' ? 0 : 1));
  const at = stop ? words.search(stop) : -1;
  if (at >= 0) words = beforeComma(words, at) || words.slice(0, at);
  if (words.length > max) words = beforeComma(words, max);
  const open = unbalancedAt(words);
  if (open >= 0) words = CLOSERS.has(words[open]) ? '' : beforeComma(words, open);
  return words.replace(/[،,:\s]+$/, '');
}
