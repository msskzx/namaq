// docs/adr/0021-a-span-selects-text-by-quote.md
const LEADING_IBN = /^[اٱ][\u064B-\u0651]?(ب)\u0652?(ن)(?=[\u064B-\u0652]*(?:\s|$))/u;
const BREAK = /[،,.؛:]$/u;

export function joinName(parts: string[]) {
  return parts
    .map((part, index) =>
      index === 0 || BREAK.test(parts[index - 1].trimEnd())
        ? part
        : part.replace(LEADING_IBN, '$1$2'),
    )
    .join(' ');
}
