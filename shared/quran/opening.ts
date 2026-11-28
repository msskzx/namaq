
export const OPENING = 220;
const PAIRS: Record<string, string> = { '«': '»', '(': ')', '[': ']', '﴿': '﴾' };
const CLOSERS = new Set(Object.values(PAIRS));

export function unbalancedAt(text: string): number {
  const open: number[] = [];
  for (let i = 0; i < text.length; i++) {
    if (PAIRS[text[i]]) open.push(i);
    else if (CLOSERS.has(text[i])) { if (!open.length) return i; open.pop(); }
  }
  return open.length ? open[0] : -1;
}

export const beforeComma = (text: string, at: number) => { const comma = text.lastIndexOf('،', at); return comma > 0 ? text.slice(0, comma) : ''; };

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
