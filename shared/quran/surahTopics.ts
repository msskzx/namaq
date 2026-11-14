import data from '../data/quran/surahTopics.json';

/**
 * The sections of each surah as al-Tafsir al-Mawdu'i li-Suwar al-Quran al-Karim (University of Sharjah, 2010) lists
 * them, read from Quranpedia's surahs dump (scripts/quran/buildSurahTopics.ts). Headings keep the book's words; a
 * section may hold smaller ones. docs/plans/surah-topics.md
 */
export type TopicSection = { title: string; from?: number; to?: number; parts?: TopicSection[] };
export type SurahTopics = { volume: number; page: number; sections: TopicSection[] };

const surahs = data.surahs as Record<string, SurahTopics>;
export const SURAH_TOPICS_VERSION = data.version;

export const surahTopicsOf = (surah: number): SurahTopics | null => surahs[surah] ?? null;

/** The top-level sections that start at an ayah, by place in the surah's list, so the reader can mark them above it. */
export const sectionsStartingAt = (surah: number | undefined, ayah: number | undefined): number[] =>
  surah === undefined || ayah === undefined ? [] : (surahTopicsOf(surah)?.sections ?? []).flatMap((section, i) => (section.from === ayah ? [i] : []));

/** The top-level section an ayah falls in (the last that starts at or before it), by place in the list. */
export const sectionAt = (surah: number, ayah: number): number => (surahTopicsOf(surah)?.sections ?? []).findLastIndex(section => section.from !== undefined && section.from <= ayah);

/** Where to read the list on Quranpedia, and the book's volume and page it cites. */
export const surahTopicsCredit = (topics: SurahTopics) =>
  `التفسير الموضوعي لسور القرآن الكريم، جامعة الشارقة، ج ${topics.volume.toLocaleString('ar-EG')} ص ${topics.page.toLocaleString('ar-EG', { useGrouping: false })}`;
