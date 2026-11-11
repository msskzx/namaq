// The quiz's tree filters as plain data, light enough for the party server: the branches page's filter keys
// (shared/quran/mutashabih/browse.ts FILTER_KEYS) but sort, which means nothing for a random quiz.
export const SCOPE_KEYS = ['categories', 'relations', 'differences', 'surahs', 'juz', 'surahFrom', 'surahTo', 'pageFrom', 'pageTo', 'cited'] as const;
export type ScopeFilters = Partial<Record<typeof SCOPE_KEYS[number], string>>;
export type TreeScope = { filters?: ScopeFilters; saved?: string[] };

/** The quiz asks the متشابهات unless the filters pick other kinds. */
export const QUIZ_CATEGORIES = 'mutashabeh';

/** The filters a quiz keeps, with the quiz's default kind. */
export function quizFilters(filters: Record<string, unknown> | undefined): ScopeFilters {
  const clean: ScopeFilters = Object.fromEntries(SCOPE_KEYS.flatMap(key => typeof filters?.[key] === 'string' && filters[key] ? [[key, (filters[key] as string).slice(0, 2000)]] : []));
  return { ...clean, categories: clean.categories ?? QUIZ_CATEGORIES };
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
