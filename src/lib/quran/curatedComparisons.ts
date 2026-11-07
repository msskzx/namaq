import { compareHref } from './compare';

export const curatedComparisons = [
  { id: 'moses-pharaoh', name: { ar: 'موسى وفرعون', voweled: 'مُوسَىٰ وَفِرۡعَوۡنُ', en: 'Moses and Pharaoh' }, a: { surah: 7, from: 103, to: 137 }, b: { surah: 26, from: 10, to: 68 } },
  { id: 'noah', name: { ar: 'نوح', voweled: 'نُوحٌ', en: 'Noah' }, a: { surah: 7, from: 59, to: 64 }, b: { surah: 26, from: 105, to: 122 } },
  { id: 'hud', name: { ar: 'هود', voweled: 'هُودٌ', en: 'Hud' }, a: { surah: 7, from: 65, to: 72 }, b: { surah: 26, from: 123, to: 140 } },
  { id: 'salih', name: { ar: 'صالح', voweled: 'صَالِحٌ', en: 'Salih' }, a: { surah: 7, from: 73, to: 79 }, b: { surah: 26, from: 141, to: 159 } },
  { id: 'lot', name: { ar: 'لوط', voweled: 'لُوطٌ', en: 'Lot' }, a: { surah: 7, from: 80, to: 84 }, b: { surah: 26, from: 160, to: 175 } },
  { id: 'shuayb', name: { ar: 'شعيب', voweled: 'شُعَيۡبٌ', en: 'Shuayb' }, a: { surah: 7, from: 85, to: 93 }, b: { surah: 26, from: 176, to: 191 } },
  { id: 'creation-iblis', name: { ar: 'الخلق وإبليس', voweled: 'الخَلۡقُ وَإِبۡلِيسُ', en: 'Creation and Iblis' }, a: { surah: 15, from: 26, to: 44 }, b: { surah: 38, from: 71, to: 85 } },
];

export const curatedSurahNames: Record<number, { ar: string; en: string; title: { ar: string; en: string } }> = {
  7: { ar: 'الأعراف', en: "Al-A'raf", title: { ar: 'سُورَةُ الأَعۡرَافِ', en: "Surat Al-A'raf" } },
  15: { ar: 'الحجر', en: 'Al-Hijr', title: { ar: 'سُورَةُ الحِجۡرِ', en: 'Surat Al-Hijr' } },
  26: { ar: 'الشعراء', en: "Ash-Shu'ara", title: { ar: 'سُورَةُ الشُّعَرَاءِ', en: "Surat Ash-Shu'ara" } },
  38: { ar: 'ص', en: 'Sad', title: { ar: 'سُورَةُ صٓ', en: 'Surat Sad' } },
};

type Preset = typeof curatedComparisons[number];

/** «سُورَةُ الأَعۡرَافِ وَسُورَةُ الشُّعَرَاءِ - مُوسَىٰ وَفِرۡعَوۡنُ» */
export function curatedTitle(preset: Preset, language: 'ar' | 'en') {
  const name = (surah: number) => curatedSurahNames[surah]?.title[language] ?? String(surah);
  return language === 'ar'
    ? `${name(preset.a.surah)} وَ${name(preset.b.surah)} - ${preset.name.voweled}`
    : `${name(preset.a.surah)} and ${name(preset.b.surah)} - ${preset.name.en}`;
}

export function curatedComparisonHref(preset: typeof curatedComparisons[number]) {
  return `${compareHref(preset.a.surah, preset.a, preset.b.surah, preset.b)}&view=ayat&preset=${preset.id}`;
}
