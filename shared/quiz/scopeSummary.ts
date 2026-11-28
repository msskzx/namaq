import surahRows from '../data/quran/surahs.json';
import { num } from '../quran/arabicNumber';
import { QUIZ_CATEGORIES, type ScopeFilters } from './scopeParams';
import { SURAH_NAMES } from '../quran/surahNames';

const KINDS: Record<string, { ar: string; en: string }> = { mutashabeh: { ar: 'في كتب المتشابهات', en: 'In the mutashabih books' }, pondering: { ar: 'تدبّر', en: 'Pondering' }, words: { ar: 'أشجار الكلمات', en: 'Word trees' } };
const surahName = (n: number, ar: boolean) => { const row = surahRows.find(item => item.number === n); return ar ? SURAH_NAMES[n] ?? String(n) : row?.nameTransliterated ?? String(n); };

export function scopeSummary({ juzFrom, juzTo, filters = {} }: { juzFrom: number; juzTo: number; filters?: ScopeFilters }, ar: boolean, trees = true) {
  const n = (value: number | string) => ar ? num(Number(value)) : String(value);
  const list = (value: string, name: (x: number) => string) => value.split(',').map(Number).map(name).join(ar ? '، ' : ', ');
  const to = ar ? 'إلى' : 'to';
  const part = filters.surahs ? `${ar ? 'سور' : 'Chapters'} ${list(filters.surahs, x => surahName(x, ar))}`
    : filters.juz ? `${ar ? 'الأجزاء' : "Juz'"} ${list(filters.juz, n)}`
    : filters.surahFrom ? `${ar ? 'السور' : 'Chapters'} ${n(filters.surahFrom)} ${to} ${n(filters.surahTo ?? 114)}`
    : filters.pageFrom ? `${ar ? 'الصفحات' : 'Pages'} ${n(filters.pageFrom)} ${to} ${n(filters.pageTo ?? 604)}`
    : `${ar ? 'الأجزاء' : "Juz'"} ${n(juzFrom)} ${to} ${n(juzTo)}`;
  if (!trees) return part;
  const kinds = (filters.categories ?? QUIZ_CATEGORIES).split(',').map(id => KINDS[id]?.[ar ? 'ar' : 'en']).filter(Boolean).join(ar ? '، ' : ', ');
  return `${kinds}${ar ? '، ' : ', '}${part}`;
}
