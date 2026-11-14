import data from '../data/quran/surahTopics.json';

/**
 * The sections of each surah as al-Tafsir al-Mawdu'i li-Suwar al-Quran al-Karim (University of Sharjah, 2010) lists
 * them, read from Quranpedia's surahs dump (scripts/quran/buildSurahTopics.ts). Headings keep the book's words; a
 * section may hold smaller ones. Al-Fatiha has none: the book treats it by aims, not ranges. docs/plans/surah-topics.md
 */
export type TopicSection = { title: string; from?: number; to?: number; parts?: TopicSection[] };
export type SurahTopics = { volume: number; page: number; sections: TopicSection[] };

const surahs = data.surahs as Record<string, SurahTopics>;
export const SURAH_TOPICS_VERSION = data.version;

export const surahTopicsOf = (surah: number): SurahTopics | null => surahs[surah] ?? null;

/** The top-level sections that start at an ayah, so the reader can mark them above it. */
export const topicsStartingAt = (surah: number, ayah: number): TopicSection[] =>
  surahTopicsOf(surah)?.sections.filter(section => section.from === ayah) ?? [];

/** Where to read the list on Quranpedia, and the book's volume and page it cites. */
export const surahTopicsCredit = (topics: SurahTopics) =>
  `التفسير الموضوعي لسور القرآن الكريم، جامعة الشارقة، ج ${topics.volume.toLocaleString('ar-EG')} ص ${topics.page.toLocaleString('ar-EG', { useGrouping: false })}`;
