import surahRows from '@shared/data/quran/surahs.json';

/** A surah's name as a label, as the app writes it: «الفاتحة» in Amiri, not the mushaf's title «سُورَةُ ٱلْفَاتِحَةِ». */
const labels = new Map(surahRows.map(row => [row.number, row.name]));
export const surahLabel = (surah: { number: number; name: string }) => labels.get(surah.number) ?? surah.name;
