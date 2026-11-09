import { branchesHref } from '@shared/quran/branches';
import { JUZ_INDEX } from './quran/juzIndex';
import { num } from '@shared/quran/arabicNumber';
import type { SearchableSurah } from './quran/surahSearch';
import { searchSurahs } from './quran/surahSearch';

/** `comparable` lists the surahs the compare page has a pair for. */
export function homeQuranSections(surahs: SearchableSurah[], comparable: Set<number> = new Set()) {
  return {
    surah: surahs.map(surah => ({
      ...surah,
      readerHref: `/quran/read/ayah/${surah.number}/1`,
      branchesHref: branchesHref('', undefined, { surah: surah.number }),
      compareHref: comparable.has(surah.number) ? `/quran/compare?a=${surah.number}` : undefined,
    })),
    juz: JUZ_INDEX.map(juz => ({
      number: juz.juz,
      name: `الجزء ${num(juz.juz)}`,
      nameTransliterated: `Juz ${juz.juz}`,
      readerHref: `/quran/read/ayah/${juz.surah}/${juz.ayah}`,
      branchesHref: branchesHref('', { from: juz.juz, to: juz.juz }),
      compareHref: undefined,
    })),
  };
}

export type HomeQuranSections = ReturnType<typeof homeQuranSections>;

export function searchHomeQuranSections(sections: HomeQuranSections, unit: keyof HomeQuranSections, query: string) {
  const needle = unit === 'juz' ? query.match(/[0-9٠-٩۰-۹]+/)?.[0] ?? query : query;
  return searchSurahs(sections[unit], needle);
}
