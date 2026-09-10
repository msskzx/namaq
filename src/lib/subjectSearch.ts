/**
 * Ranks historical subjects -- person, title, battle or event (see CONTEXT.md)
 * -- against a search query. One normalizer serves every kind, Latin
 * spelling-equivalence table included: those spellings appear inside battle
 * and event names too.
 *
 * `graphRank` (1 = most prominent) is only read here, never computed;
 * scripts/graph/computeGraphLayout.ts produces it. See
 * docs/graph-subject-search.md for why it is the sole prominence signal.
 * `kind` is absent from the candidate because nothing here ranks by it.
 */
export type SubjectKind = 'person' | 'title' | 'battle' | 'event';

export interface SubjectSearchCandidate {
  slug: string;
  name: string;
  /** The full nasab string. People only. */
  fullName?: string | null;
  nameTransliterated: string | null;
  graphRank: number | null;
}

export type SubjectSearchMatch = 'exact' | 'prefix' | 'contains';

export interface SubjectSearchResult {
  score: number;
  match: SubjectSearchMatch;
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

export function normalizeSubjectSearch(value: string): string {
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

function matchField(query: string, value: string | null | undefined): SubjectSearchResult | null {
  if (!value) return null;

  const normalizedValue = normalizeSubjectSearch(value);
  if (!normalizedValue) return null;

  if (normalizedValue === query) return { score: 0, match: 'exact' };

  const words = normalizedValue.split(' ');
  if (words.includes(query)) return { score: 1, match: 'exact' };
  if (normalizedValue.startsWith(query)) return { score: 2, match: 'prefix' };
  if (normalizedValue.includes(query)) return { score: 3, match: 'contains' };

  return null;
}

/** Returns the best match across every display and URL field for one subject. */
export function rankSubjectSearch(
  query: string,
  subject: SubjectSearchCandidate
): SubjectSearchResult | null {
  const normalizedQuery = normalizeSubjectSearch(query);
  if (!normalizedQuery) return null;

  const matches = [
    matchField(normalizedQuery, subject.name),
    matchField(normalizedQuery, subject.fullName),
    matchField(normalizedQuery, subject.nameTransliterated),
    matchField(normalizedQuery, subject.slug.replace(/-/g, ' ')),
  ].filter((match): match is SubjectSearchResult => match !== null);

  if (!matches.length) return null;
  return matches.reduce((best, match) => (match.score < best.score ? match : best));
}

/**
 * Match quality first, then graphRank, then name. Ranking match quality first
 * means prominence only ever separates subjects the query already matched.
 */
export function filterAndRankSubjects<T extends SubjectSearchCandidate>(subjects: T[], query: string) {
  return subjects
    .map((subject) => {
      const result = rankSubjectSearch(query, subject);
      return result ? { subject, ...result } : null;
    })
    .filter((result): result is { subject: T } & SubjectSearchResult => result !== null)
    .sort((a, b) =>
      a.score - b.score ||
      (a.subject.graphRank ?? Number.MAX_SAFE_INTEGER) - (b.subject.graphRank ?? Number.MAX_SAFE_INTEGER) ||
      a.subject.name.localeCompare(b.subject.name, 'ar') ||
      a.subject.slug.localeCompare(b.subject.slug)
    );
}
