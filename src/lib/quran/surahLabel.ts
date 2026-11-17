import { surahName } from '@shared/quran/surahNames';

/** A surah's name as a label: the one surah-name list, with tashkeel. */
export const surahLabel = (surah: { number: number }) => surahName(surah.number);
