import { compareHref } from './compare';

export const curatedComparisons = [
  { id: 'moses-pharaoh', name: { ar: 'موسى وفرعون', en: 'Moses and Pharaoh' }, a: { surah: 7, from: 103, to: 137 }, b: { surah: 26, from: 10, to: 68 } },
  { id: 'noah', name: { ar: 'نوح', en: 'Noah' }, a: { surah: 7, from: 59, to: 64 }, b: { surah: 26, from: 105, to: 122 } },
  { id: 'hud', name: { ar: 'هود', en: 'Hud' }, a: { surah: 7, from: 65, to: 72 }, b: { surah: 26, from: 123, to: 140 } },
  { id: 'salih', name: { ar: 'صالح', en: 'Salih' }, a: { surah: 7, from: 73, to: 79 }, b: { surah: 26, from: 141, to: 159 } },
  { id: 'lot', name: { ar: 'لوط', en: 'Lot' }, a: { surah: 7, from: 80, to: 84 }, b: { surah: 26, from: 160, to: 175 } },
  { id: 'shuayb', name: { ar: 'شعيب', en: 'Shuayb' }, a: { surah: 7, from: 85, to: 93 }, b: { surah: 26, from: 176, to: 191 } },
  { id: 'creation-iblis', name: { ar: 'الخلق وإبليس', en: 'Creation and Iblis' }, a: { surah: 15, from: 26, to: 44 }, b: { surah: 38, from: 71, to: 85 } },
];

export function curatedComparisonHref(preset: typeof curatedComparisons[number]) {
  return `${compareHref(preset.a.surah, preset.a, preset.b.surah, preset.b)}&view=ayat&preset=${preset.id}`;
}
