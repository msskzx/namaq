import type { AdhkarCitation, AdhkarOccasion, Dhikr, DhikrGrade } from './adhkar';
import { num } from './quran/arabicNumber';
import { sourceById } from './sources';
import type { SourceEntry } from './quiz/sources';

export const ADHKAR_LABELS: Record<AdhkarOccasion, string> = { morning: 'صباح', evening: 'مساء', waking: 'يقظة', sleep: 'نوم', 'after-prayer': 'صلاة' };
export const ADHKAR_TABS: AdhkarOccasion[] = ['morning', 'evening', 'sleep', 'waking', 'after-prayer'];

const BOOK: Record<AdhkarCitation['source'], string> = { 'adhkar-nawawi': 'الأذكار', 'nataij-afkar': 'نتائج الأفكار' };

export const adhkarCite = (citation: AdhkarCitation) =>
  `${BOOK[citation.source]} ${citation.volume > 1 ? `${num(citation.volume)}/` : ''}${num(citation.page)}${citation.report ? ` ح${num(citation.report)}` : ''}`;

export const ADHKAR_TITLES: Record<AdhkarOccasion, string> = { morning: 'الصباح', evening: 'المساء', waking: 'الاستيقاظ', sleep: 'النوم', 'after-prayer': 'ما بعد الصلاة' };

export const adhkarTitle = (item: Dhikr) => `${adhkarCite(item.citation)} · ${item.collections.join('، ')}`;

export function adhkarQuotes(item: Dhikr): { text: string; cite: string; url: string }[] {
  const at = { cite: adhkarCite(item.citation), url: item.citation.url };
  return [
    { text: item.occasionQuote, ...at },
    ...(item.repeat ? [{ text: item.repeat.quote, ...at }] : []),
    ...(item.instructionQuote ? [{ text: item.instructionQuote, ...at }] : []),
    ...(item.noteQuote ? [{ text: item.noteQuote, ...at }] : []),
    ...(item.fixes ?? []).map(fix => ({
      text: fix.quote,
      cite: `في المطبوع «${fix.printed}»، والصواب «${fix.reads}» كما هنا: ${adhkarCite(fix.citation)}`,
      url: fix.citation.url,
    })),
    ...item.grades.map(grade => ({
      text: grade.quote,
      cite: `${grade.scholar}${grade.reportedBy ? `، نقله ${grade.reportedBy}` : ''}، ${adhkarCite(grade.citation)}`,
      url: grade.citation.url,
    })),
  ];
}

export const ADHKAR_NAMES: Record<AdhkarOccasion, string> = { morning: 'الصباح', evening: 'المساء', sleep: 'النوم', waking: 'الاستيقاظ', 'after-prayer': 'الصلاة' };

const RANK: Record<DhikrGrade['rank'], string> = { sahih: 'صحيح', hasan: 'حسن', 'hasan-sahih': 'حسن صحيح', 'isnad-sahih': 'إسناده صحيح', 'in-sahih': 'في الصحيح' };

export function gradeLine(item: Dhikr): { grades: { rank: string; by: string }[]; recorded: string } {
  return {
    grades: item.grades.map(grade => ({ rank: RANK[grade.rank], by: `${grade.scholar}${grade.reportedBy ? `، نقله ${grade.reportedBy}` : ''}` })),
    recorded: item.collections.join('، '),
  };
}

export function adhkarSource(item: Dhikr): SourceEntry {
  const books = [...new Set([item.citation.source, ...item.grades.map(grade => grade.citation.source)])];
  return {
    line: adhkarTitle(item), quotes: adhkarQuotes(item),
    places: item.grades.map(grade => `${grade.quote.startsWith('قال ') ? '' : `${grade.scholar}: `}«${grade.quote}»${grade.reportedBy ? `، نقله ${grade.reportedBy}` : ''}، ${adhkarCite(grade.citation)}`),
    editions: books.flatMap(book => { const edition = sourceById(book)?.edition; return edition ? [`${BOOK[book]}: ${edition}`] : []; }),
  };
}
