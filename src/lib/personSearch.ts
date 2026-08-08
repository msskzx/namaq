/**
 * Search helpers for the PostgreSQL-backed person directory.
 *
 * These helpers deliberately only rank fields stored on a Person record. They
 * do not use Neo4j nodes or relationships, since the two stores are currently
 * maintained independently.
 */
export interface PersonSearchCandidate {
  slug: string;
  name: string;
  fullName: string | null;
  nameTransliterated: string | null;
}

export type PersonSearchMatch = 'exact' | 'prefix' | 'contains';

export interface PersonSearchResult {
  score: number;
  match: PersonSearchMatch;
}

const ARABIC_DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;

// These are spelling equivalents, not additional historical names. Editorial
// aliases should be stored as source-backed data when that model is introduced.
const LATIN_WORD_EQUIVALENTS: Record<string, string> = {
  abo: 'abu',
  aisha: 'aishah',
  ayesha: 'aishah',
  fatima: 'fatimah',
  khadija: 'khadijah',
  mohamed: 'muhammad',
  mohammed: 'muhammad',
  mohammad: 'muhammad',
  muhammed: 'muhammad',
  omar: 'umar',
  osman: 'uthman',
  othman: 'uthman',
  uthmaan: 'uthman',
  zainab: 'zaynab',
};

export function normalizePersonSearch(value: string): string {
  const normalized = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(ARABIC_DIACRITICS, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

  if (/^[\x00-\x7F]*$/.test(normalized)) {
    return normalized
      .split(/\s+/)
      .map((word) => {
        if (word === 'bin' || word === 'ben') return 'ibn';
        return LATIN_WORD_EQUIVALENTS[word] || word;
      })
      .join(' ');
  }

  return normalized;
}

function matchField(query: string, value: string | null): PersonSearchResult | null {
  if (!value) return null;

  const normalizedValue = normalizePersonSearch(value);
  if (!normalizedValue) return null;

  if (normalizedValue === query) return { score: 0, match: 'exact' };

  const words = normalizedValue.split(' ');
  if (words.includes(query)) return { score: 1, match: 'exact' };
  if (normalizedValue.startsWith(query)) return { score: 2, match: 'prefix' };
  if (normalizedValue.includes(query)) return { score: 3, match: 'contains' };

  return null;
}

/** Returns the best match across every display and URL field for one person. */
export function rankPersonSearch(
  query: string,
  person: PersonSearchCandidate
): PersonSearchResult | null {
  const normalizedQuery = normalizePersonSearch(query);
  if (!normalizedQuery) return null;

  const matches = [
    matchField(normalizedQuery, person.name),
    matchField(normalizedQuery, person.fullName),
    matchField(normalizedQuery, person.nameTransliterated),
    matchField(normalizedQuery, person.slug.replace(/-/g, ' ')),
  ].filter((match): match is PersonSearchResult => match !== null);

  if (!matches.length) return null;
  return matches.reduce((best, match) => (match.score < best.score ? match : best));
}

export function filterAndRankPeople<T extends PersonSearchCandidate>(people: T[], query: string) {
  return people
    .map((person) => {
      const result = rankPersonSearch(query, person);
      return result ? { person, ...result } : null;
    })
    .filter((result): result is { person: T } & PersonSearchResult => result !== null)
    .sort((a, b) =>
      a.score - b.score ||
      a.person.name.localeCompare(b.person.name, 'ar') ||
      a.person.slug.localeCompare(b.person.slug)
    );
}
