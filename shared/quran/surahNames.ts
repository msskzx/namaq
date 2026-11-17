import surahRows from '../data/quran/surahs.json';

/**
 * The one list of surah names the app and the website show, with tashkeel.
 *
 * Each name is the Madina mushaf's own surah title without «سُورَةُ», read in
 * pause (الوقف بالسكون): the case vowel the title gives the last letter after
 * «سورة» becomes a sukun («سُورَةُ البَقَرَةِ» → «البَقَرَةْ»). Names are shown in
 * Amiri, so every sukun is the round ْ, not the mushaf's ۡ. A name ending in a long vowel, a shadda, a
 * sukun or the separate letters (طه، يسٓ) stays as the title writes it.
 * FIXES holds the few names a dropped vowel cannot settle (a hamza whose seat
 * changes, a construct's first word) and the title's stray tatweel and wasla.
 * A vowel the title leaves out stays out («المُجَادلَة», «المُمۡتَحنَة»: both
 * readings are known).
 *
 * The plain `name` in surahs.json is for matching only: search, parsing typed
 * references. Never show it.
 */
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

/** Surah names by number (1–114). */
export const SURAH_NAMES: Readonly<Record<number, string>> = Object.freeze(
  Object.fromEntries(surahRows.map(row => [row.number, FIXES[row.number] ?? pause(row.title)])),
);

/** The mushaf's own surah titles, for the surah headers on a mushaf page only: «سُورَةُ البَقَرَةِ». */
export const SURAH_TITLES: Readonly<Record<number, string>> = Object.freeze(
  Object.fromEntries(surahRows.map(row => [row.number, row.title.replace(/ـ/g, '')])),
);

/** A surah's name with tashkeel, as shown everywhere: «البَقَرَة». */
export const surahName = (number: number): string => SURAH_NAMES[number] ?? String(number);
