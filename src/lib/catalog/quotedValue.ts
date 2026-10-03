// Rules: docs/plans/tashkeel-and-literal-wording-audit.md; terms: CONTEXT.md (Seam, Quoted value).

const COLLECTION_MARKS = /\*+(?:\s*\([^)]*\))?/g;
const FOOTNOTE_MARKER = /\(\s*[٠-٩0-9]+\s*\)/g;
const ENTRY_NUMBER = /^[٠-٩0-9]+\s*[-–—]\s*/;
const SENTENCE_INITIAL_IBN = /^ابْ?ن/;

export function cleanPassage(text: string): string {
  return text
    .replace(ENTRY_NUMBER, '')
    .replace(COLLECTION_MARKS, ' ')
    .replace(FOOTNOTE_MARKER, ' ')
    .replace(/\s+([،؛:.!؟])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export function joinAtSeams(passages: readonly string[], keepStops = false): string {
  const cleaned = passages.map(cleanPassage).filter(Boolean);
  return cleaned.reduce((joined, next, index) => {
    if (index === 0) return next;
    return `${keepStops ? joined : joined.replace(/\.$/, '')} ${next.replace(SENTENCE_INITIAL_IBN, 'بن')}`;
  }, '');
}

export type QuotedValueResult =
  | { ok: true }
  | { ok: false; reason: 'diverges'; matched: string; next: string }
  | { ok: false; reason: 'pieces'; matched: string; next: string };

/** Each group is the paragraphs of one cited page; a value may be tiled by at most one clip per group. */
export function matchQuotedValue(value: string, groups: readonly (readonly string[])[]): QuotedValueResult {
  const result = matchExact(value, groups);
  const closed = value.trim().replace(/\.$/, '');
  return !result.ok && closed !== value.trim() ? (matchExact(closed, groups).ok ? { ok: true } : result) : result;
}

function matchExact(value: string, groups: readonly (readonly string[])[]): QuotedValueResult {
  const haystacks = groups.flatMap((group) => [...group.map(cleanPassage), joinAtSeams(group), joinAtSeams(group, true)]);
  const tokens = value.replace(/\s+/g, ' ').trim().split(' ');
  const found = (text: string) => haystacks.some((haystack) => haystack.includes(text));

  let index = 0;
  let pieces = 0;
  while (index < tokens.length) {
    let end = index;
    while (end < tokens.length && found(tokens.slice(index, end + 1).join(' '))) end += 1;
    if (end === index) {
      const token = tokens[index];
      let length = 0;
      while (length < token.length && found(token.slice(0, length + 1))) length += 1;
      const before = tokens.slice(0, index).join(' ');
      return {
        ok: false,
        reason: 'diverges',
        matched: `${before}${before ? ' ' : ''}${token.slice(0, length)}`,
        next: [token.slice(length), ...tokens.slice(index + 1)].join(' ').slice(0, 24),
      };
    }
    index = end;
    pieces += 1;
  }
  if (pieces > Math.max(groups.length, 1)) {
    return { ok: false, reason: 'pieces', matched: tokens.join(' '), next: '' };
  }
  return { ok: true };
}
