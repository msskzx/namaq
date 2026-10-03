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

export type QuotedValueResult = { ok: true } | { ok: false; reason: 'diverges'; matched: string; next: string };

const NEXT_CHARS = 24;

export function matchQuotedValue(value: string, groups: readonly (readonly string[])[]): QuotedValueResult {
  const result = matchExact(value, groups);
  const closed = value.trim().replace(/\.$/, '');
  return !result.ok && closed !== value.trim() ? (matchExact(closed, groups).ok ? { ok: true } : result) : result;
}

function matchExact(value: string, groups: readonly (readonly string[])[]): QuotedValueResult {
  const haystacks = groups.flatMap((group) => [...group.map(cleanPassage), joinAtSeams(group), joinAtSeams(group, true)]);
  const chars = [...value.replace(/\s+/g, ' ').trim()];
  if (haystacks.some((haystack) => haystack.includes(chars.join('')))) return { ok: true };

  let matched = 0;
  for (const haystack of haystacks) {
    let length = 0;
    while (length < chars.length && haystack.includes(chars.slice(0, length + 1).join(''))) length += 1;
    matched = Math.max(matched, length);
  }
  return { ok: false, reason: 'diverges', matched: chars.slice(0, matched).join(''), next: chars.slice(matched, matched + NEXT_CHARS).join('') };
}
