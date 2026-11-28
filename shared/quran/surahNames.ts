import surahRows from '../data/quran/surahs.json';

const FIXES: Record<number, string> = {
  1: 'الفَاتِحَةْ',
  3: 'آلِ عِمْرَانْ',
  5: 'المَائِدَةْ',
  34: 'سَبَأْ',
  55: 'الرَّحْمَٰنْ',
  78: 'النَّبَأْ',
};

const VOWEL = /[\u064B-\u0650]$/;
const pause = (title: string) => {
  const name = title.replace(/^سُورَةُ /, '').replace(/\u06E1/g, '\u0652');
  return name.replace(VOWEL, '\u0652');
};

export const SURAH_NAMES: Readonly<Record<number, string>> = Object.freeze(
  Object.fromEntries(surahRows.map(row => [row.number, FIXES[row.number] ?? pause(row.title)])),
);

export const SURAH_TITLES: Readonly<Record<number, string>> = Object.freeze(
  Object.fromEntries(surahRows.map(row => [row.number, row.title.replace(/ـ/g, '')])),
);

export const surahName = (number: number): string => SURAH_NAMES[number] ?? String(number);
