// docs/adr/0023-files-are-the-authority-and-both-databases-are-derived.md
import type { Language } from '@/components/language/LanguageContext';

export interface ModelEntryDto {
  unit: string;
  assertionId: string;
  predicate: string;
  parts: string[];
  text: string;
  parsed: number | null;
  classified: string | null;
  object: string | null;
  objectMention: string | null;
  origins: ({ author: string } | { mention: string })[];
  spanIds: string[];
  status: string;
  identification: string;
  reviewed: boolean;
}

export interface ModelSpanDto {
  unit: string;
  spanId: string;
  witness: string;
  volume: number;
  page: string;
}

type Pair = { ar: string; en: string };

export const predicateOrder = [
  'name.full',
  'name.kunya',
  'sex',
  'title',
  'CHILD_OF',
  'MARRIED',
  'PATERNAL_COUSIN',
  'appearance',
  'virtue',
  'islam.age',
  'died.year',
  'PARTICIPATED_IN',
];

export const predicateLabels: Record<string, Pair> = {
  'name.full': { ar: 'الاسم الكامل', en: 'Full name' },
  'name.kunya': { ar: 'الكنية', en: 'Kunya' },
  sex: { ar: 'الجنس', en: 'Sex' },
  title: { ar: 'الألقاب', en: 'Titles' },
  CHILD_OF: { ar: 'النسب', en: 'Parentage' },
  MARRIED: { ar: 'الزواج', en: 'Marriage' },
  PATERNAL_COUSIN: { ar: 'القرابة (ابن/ابنة عمة)', en: 'Kinship (child of a paternal aunt)' },
  appearance: { ar: 'الصفة', en: 'Appearance' },
  virtue: { ar: 'من فضائله', en: 'Virtues' },
  'islam.age': { ar: 'عمره عند إسلامه', en: 'Age at Islam' },
  'died.year': { ar: 'سنة وفاته', en: 'Year of death' },
  PARTICIPATED_IN: { ar: 'المشاهد', en: 'Battles and expeditions' },
};

const works: Record<string, Pair> = {
  'siyar-alam-al-nubala-risalah': { ar: 'سير أعلام النبلاء', en: "Siyar A'lam al-Nubala'" },
};

const authors: Record<string, Pair> = {
  'al-dhahabi': { ar: 'الذهبي', en: 'al-Dhahabi' },
};

export function predicateLabel(predicate: string, language: Language) {
  return predicateLabels[predicate]?.[language] ?? predicate;
}

export function isBookText(entry: ModelEntryDto) {
  return entry.parsed === null && entry.classified === null;
}

export function valueLines(entry: ModelEntryDto, language: Language) {
  const ar = language === 'ar';
  if (entry.classified && entry.predicate === 'sex') {
    return [entry.classified === 'MALE' ? (ar ? 'ذكر' : 'Male') : ar ? 'أنثى' : 'Female'];
  }
  if (entry.parsed !== null) {
    if (entry.predicate === 'died.year') return [ar ? `${entry.parsed} هـ` : `${entry.parsed} AH`];
    if (entry.predicate === 'islam.age')
      return [ar ? `${entry.parsed} سنة` : `${entry.parsed} years`];
    return [String(entry.parsed)];
  }
  if (entry.object !== null || entry.objectMention !== null) {
    return entry.objectMention ? [entry.objectMention] : entry.parts;
  }
  return entry.predicate === 'name.full' ? [entry.text] : entry.parts;
}

export function originLabel(origin: ModelEntryDto['origins'][number], language: Language) {
  if ('author' in origin) {
    const name = authors[origin.author]?.[language] ?? origin.author;
    return language === 'ar' ? `المصنف: ${name}` : `The author: ${name}`;
  }
  return language === 'ar' ? `ورد عن: ${origin.mention}` : `Reported from: ${origin.mention}`;
}

export function citationLabel(entry: ModelEntryDto, spans: ModelSpanDto[], language: Language) {
  const span = spans.find((s) => s.unit === entry.unit && s.spanId === entry.spanIds[0]);
  if (!span) return null;
  const work = works[span.witness]?.[language] ?? span.witness;
  return language === 'ar'
    ? `${work}، مج ${span.volume}، ص ${span.page}`
    : `${work}, vol. ${span.volume}, p. ${span.page}`;
}

export function statusLabel(entry: ModelEntryDto, language: Language) {
  if (entry.reviewed) return language === 'ar' ? 'مراجَع' : 'Reviewed';
  return language === 'ar' ? 'غير مراجَع' : 'Not reviewed';
}
