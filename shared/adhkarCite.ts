import type { AdhkarCitation, AdhkarOccasion, Dhikr } from './adhkar';
import { num } from './quran/arabicNumber';

/** The adhkar page's tabs, in their order, with their short names (app and website). */
export const ADHKAR_LABELS: Record<AdhkarOccasion, string> = { morning: 'صباح', evening: 'مساء', waking: 'يقظة', sleep: 'نوم', 'after-prayer': 'صلاة' };
export const ADHKAR_TABS: AdhkarOccasion[] = ['morning', 'evening', 'sleep', 'waking', 'after-prayer'];

const BOOK: Record<AdhkarCitation['source'], string> = { 'adhkar-nawawi': 'الأذكار', 'nataij-afkar': 'نتائج الأفكار' };

/** «الأذكار ٧٨ ح٢١٣», with the volume before the page when the book has several («نتائج الأفكار ٢/٢٩٧»). */
export const adhkarCite = (citation: AdhkarCitation) =>
  `${BOOK[citation.source]} ${citation.volume > 1 ? `${num(citation.volume)}/` : ''}${num(citation.page)}${citation.report ? ` ح${num(citation.report)}` : ''}`;

/** A card's reference line: the book and page, and the collections that hold it. */
export const adhkarTitle = (item: Dhikr) => `${adhkarCite(item.citation)} · ${item.collections.join('، ')}`;

/**
 * A card's reference: al-Nawawi's words on when, how often and what to do, any remark in the report, each corrected
 * printing slip with the words that give the right reading, then every grade in its scholar's words with its own page.
 */
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
