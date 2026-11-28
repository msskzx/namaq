export const QUIZ_ONLY_KEYS = ['apart', 'run'] as const;
export const SCOPE_KEYS = ['categories', 'relations', 'differences', 'surahs', 'juz', 'surahFrom', 'surahTo', 'pageFrom', 'pageTo', 'cited', ...QUIZ_ONLY_KEYS] as const;
export type ScopeFilters = Partial<Record<typeof SCOPE_KEYS[number], string>>;
export type TreeScope = { filters?: ScopeFilters; saved?: string[] };

export const QUIZ_CATEGORIES = 'mutashabeh';

export function quizFilters(filters: Record<string, unknown> | undefined): ScopeFilters {
  const clean: ScopeFilters = Object.fromEntries(SCOPE_KEYS.flatMap(key => typeof filters?.[key] === 'string' && filters[key] ? [[key, (filters[key] as string).slice(0, 2000)]] : []));
  return { ...clean, categories: QUIZ_CATEGORIES };
}

export function treeScopeParams(scope: TreeScope): [string, string][] {
  const entries = Object.entries(quizFilters(scope.filters)).filter(([key, value]) => value && !(key === 'categories' && value === QUIZ_CATEGORIES)) as [string, string][];
  return scope.saved ? [...entries, ['saved', scope.saved.join(',')]] : entries;
}

export function parseTreeScope(params: URLSearchParams): TreeScope {
  const filters = quizFilters(Object.fromEntries(params));
  const saved = params.get('saved');
  return saved === null ? { filters } : { filters, saved: saved.split(',').filter(Boolean) };
}
