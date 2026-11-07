/** Surah pairs pinned at the top of the compare list: the same story told in both surahs. */
export const curatedComparisons = [
  { id: 'adam-israel', a: 2, b: 7, name: { ar: 'آدم وبنو إسرائيل', voweled: 'آدَمُ وَبَنُو إِسۡرَٰٓءِيلَ', en: 'Adam and the Children of Israel' } },
  { id: 'prophets', a: 7, b: 11, name: { ar: 'نوح وهود وصالح وشعيب', voweled: 'نُوحٌ وَهُودٌ وَصَٰلِحٌ وَشُعَيۡبٌ', en: 'Noah, Hud, Salih and Shuayb' } },
  { id: 'moses-pharaoh', a: 7, b: 26, name: { ar: 'موسى وفرعون', voweled: 'مُوسَىٰ وَفِرۡعَوۡنُ', en: 'Moses and Pharaoh' } },
  { id: 'creation-iblis', a: 15, b: 38, name: { ar: 'الخلق وإبليس', voweled: 'الخَلۡقُ وَإِبۡلِيسُ', en: 'Creation and Iblis' } },
] as const;

export type CuratedComparison = typeof curatedComparisons[number];

export const surahPairHref = (a: number, b: number) => `/quran/compare?a=${Math.min(a, b)}&b=${Math.max(a, b)}`;

export const curatedFor = (a: number, b: number) => curatedComparisons.find(story => story.a === Math.min(a, b) && story.b === Math.max(a, b));
