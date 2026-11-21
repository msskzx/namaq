// The quiz's tree filters as plain data, light enough for the party server: the branches page's filter keys
// (shared/quran/mutashabih/browse.ts FILTER_KEYS) but sort, which means nothing for a random quiz.
// `apart` is the quiz's own: «رتّب السور» asks surahs spread apart instead of neighbours (owner, 2026-11-20).
// `run` is the home card's: «رتّب الجزء كله» asks a run of surahs that fits a card instead of a whole juz (owner, 2026-11-21).
export const QUIZ_ONLY_KEYS = ['apart', 'run'] as const;
export const SCOPE_KEYS = ['categories', 'relations', 'differences', 'surahs', 'juz', 'surahFrom', 'surahTo', 'pageFrom', 'pageTo', 'cited', ...QUIZ_ONLY_KEYS] as const;
export type ScopeFilters = Partial<Record<typeof SCOPE_KEYS[number], string>>;
export type TreeScope = { filters?: ScopeFilters; saved?: string[] };

/**
 * The quiz asks only the mutashabihat the books name («في كتب المتشابهات»), never our own «تدبّر» pairs or the word trees
 * (owner, 2026-11-19), whatever kinds a stored setting or a link still carries.
 */
export const QUIZ_CATEGORIES = 'mutashabeh';

/** The filters a quiz keeps, with the books' kind always. */
export function quizFilters(filters: Record<string, unknown> | undefined): ScopeFilters {
  const clean: ScopeFilters = Object.fromEntries(SCOPE_KEYS.flatMap(key => typeof filters?.[key] === 'string' && filters[key] ? [[key, (filters[key] as string).slice(0, 2000)]] : []));
  return { ...clean, categories: QUIZ_CATEGORIES };
}

/** The scope as query parameters, for the quiz API; the default kind is left out. */
export function treeScopeParams(scope: TreeScope): [string, string][] {
  const entries = Object.entries(quizFilters(scope.filters)).filter(([key, value]) => value && !(key === 'categories' && value === QUIZ_CATEGORIES)) as [string, string][];
  return scope.saved ? [...entries, ['saved', scope.saved.join(',')]] : entries;
}

export function parseTreeScope(params: URLSearchParams): TreeScope {
  const filters = quizFilters(Object.fromEntries(params));
  const saved = params.get('saved');
  return saved === null ? { filters } : { filters, saved: saved.split(',').filter(Boolean) };
}
