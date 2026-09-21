/**
 * Years before the hijra are negative, and there is no year zero: -1 is the
 * year the sira writes قبل الهجرة بسنة, the one the hijra came at the end of.
 * The column is a plain `Int`, so nothing in the database enforces that; what
 * does is `validateCatalog`, which rejects a zero, and these two functions,
 * which are the only place the convention turns into something a reader sees.
 *
 * See README, "What is implemented".
 */
export function formatHijriYear(year: number, language: string): string {
  const era = language === 'ar' ? (year < 0 ? 'ق.هـ' : 'هـ') : year < 0 ? 'BH' : 'AH';
  return `${Math.abs(year)} ${era}`;
}

/**
 * Orders a timeline, putting undated entries first. A plain `(a ?? 0) - (b ?? 0)`
 * did that only while every year was positive; with years before the hijra it
 * would drop an undated entry into the middle of them.
 */
export function compareHijriYear(a: number | null | undefined, b: number | null | undefined): number {
  if (a === null || a === undefined) return b === null || b === undefined ? 0 : -1;
  if (b === null || b === undefined) return 1;
  return a - b;
}
