// docs/adr/0021-a-span-selects-text-by-quote.md
const LEADING_IBN = /^ا[ً-ّ]?(ب)ْ?(ن)(?=[ً-ْ]*(?:\s|$))/u;

export function joinName(parts: string[]) {
  return parts
    .map((part, index) => (index === 0 ? part : part.replace(LEADING_IBN, '$1$2')))
    .join(' ');
}
