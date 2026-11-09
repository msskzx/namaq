export type ScopeUnit = 'juz' | 'surah' | 'page' | 'surahs' | 'juzs';
/** What the side pane is narrowed to: one range, or a list of chapters or juz. */
export type CompareScope = { unit: 'juz' | 'surah' | 'page'; from: number; to: number } | { unit: 'surahs' | 'juzs'; list: number[] };
export type SurahSpans = { juz: Record<number, [number, number]>; page: Record<number, [number, number]> };

export const SCOPE_MAX = { juz: 30, surah: 114, page: 604 };
const PARAMS = { juz: 'juz', surah: 'surah', page: 'page', surahs: 'surahs', juzs: 'juzs' } as const;

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/** The filter in the address (`juz=26-30`, `surahs=2,3`), or nothing when it is absent or invalid. */
export function parseScope(query: Record<string, string | string[] | undefined>): CompareScope | undefined {
  for (const unit of ['juz', 'surah', 'page'] as const) {
    const match = one(query[PARAMS[unit]])?.match(/^(\d+)-(\d+)$/);
    if (!match) continue;
    const [from, to] = [Number(match[1]), Number(match[2])];
    if (from >= 1 && from <= to && to <= SCOPE_MAX[unit]) return { unit, from, to };
  }
  for (const unit of ['surahs', 'juzs'] as const) {
    const value = one(query[PARAMS[unit]]);
    if (!value || !/^\d+(,\d+)*$/.test(value)) continue;
    const max = unit === 'surahs' ? SCOPE_MAX.surah : SCOPE_MAX.juz;
    const list = value.split(',').map(Number).filter(n => n >= 1 && n <= max);
    if (list.length) return { unit, list };
  }
  return undefined;
}

export function scopeParam(scope: CompareScope | undefined) {
  if (!scope) return '';
  return `&${PARAMS[scope.unit]}=${'list' in scope ? scope.list.join(',') : `${scope.from}-${scope.to}`}`;
}

const overlaps = (span: [number, number] | undefined, from: number, to: number) => !!span && span[0] <= to && from <= span[1];

/** A page belongs to the filter when both of its surahs fall inside it. */
export function pageInScope(page: { a: number; b: number }, spans: SurahSpans, scope: CompareScope) {
  return [page.a, page.b].every(surah => {
    switch (scope.unit) {
      case 'surah': return surah >= scope.from && surah <= scope.to;
      case 'surahs': return scope.list.includes(surah);
      case 'juz': return overlaps(spans.juz[surah], scope.from, scope.to);
      case 'page': return overlaps(spans.page[surah], scope.from, scope.to);
      case 'juzs': return scope.list.some(juz => overlaps(spans.juz[surah], juz, juz));
    }
  });
}
