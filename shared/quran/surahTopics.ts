import data from '../data/quran/surahTopics.json';

// see docs/plans/surah-topics.md
export type TopicSection = { title: string; from?: number; to?: number; parts?: TopicSection[] };
export type SurahTopics = { volume: number; page: number; sections: TopicSection[] };

const surahs = data.surahs as Record<string, SurahTopics>;
export const SURAH_TOPICS_VERSION = data.version;

export const surahTopicsOf = (surah: number): SurahTopics | null => surahs[surah] ?? null;

export const sectionStart = (section: TopicSection): number | undefined => section.from ?? (section.parts?.length ? sectionStart(section.parts[0]) : undefined);

export const sectionsStartingAt = (surah: number | undefined, ayah: number | undefined): number[] =>
  surah === undefined || ayah === undefined ? [] : (surahTopicsOf(surah)?.sections ?? []).flatMap((section, i) => (sectionStart(section) === ayah ? [i] : []));

export const sectionAt = (surah: number, ayah: number): number => {
  const starts = (surahTopicsOf(surah)?.sections ?? []).map(sectionStart);
  const latest = Math.max(-1, ...starts.filter((from): from is number => from !== undefined && from <= ayah));
  return latest < 0 ? -1 : starts.indexOf(latest);
};

export const surahTopicsCredit = (topics: SurahTopics) =>
  `التفسير الموضوعي لسور القرآن الكريم، جامعة الشارقة، ج ${topics.volume.toLocaleString('ar-EG')} ص ${topics.page.toLocaleString('ar-EG', { useGrouping: false })}`;
