import { branchesHref } from './quran/branches';
import { JUZ_INDEX } from './quran/juzIndex';
import { num } from './quran/arabicNumber';
import type { SearchableSurah } from './quran/surahSearch';
import { searchSurahs } from './quran/surahSearch';

export function homeQuranSections(surahs: SearchableSurah[]) {
  return {
    surah: surahs.map(surah => ({
      ...surah,
      readerHref: `/quran/read/ayah/${surah.number}/1`,
      branchesHref: branchesHref('', undefined, { surah: surah.number }),
    })),
    juz: JUZ_INDEX.map(juz => ({
      number: juz.juz,
      name: `الجزء ${num(juz.juz)}`,
      nameTransliterated: `Juz ${juz.juz}`,
      readerHref: `/quran/read/ayah/${juz.surah}/${juz.ayah}`,
      branchesHref: branchesHref('', { from: juz.juz, to: juz.juz }),
    })),
  };
}

export type HomeQuranSections = ReturnType<typeof homeQuranSections>;

export function searchHomeQuranSections(sections: HomeQuranSections, unit: keyof HomeQuranSections, query: string) {
  const needle = unit === 'juz' ? query.match(/[0-9٠-٩۰-۹]+/)?.[0] ?? query : query;
  return searchSurahs(sections[unit], needle);
}
