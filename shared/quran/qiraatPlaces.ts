import { normalizeWord } from './normalize';
import { READERS, RIWAYAT, type ReaderId } from './qiraat';
import { qiraatAyat, qiraatOf } from './qiraatData';
import { surahName } from './surahNames';

/**
 * «القراءات» (owner, 2026-11-19): every place the ten readers differ, in the mushaf's order under its surah, for the app's
 * and the website's page. A place is an ayah and the word differences of it that are shown (their places in qiraatOf).
 */
export type QiraatPlace = { key: string; words: number[] };
export type QiraatSurah = { surah: number; places: QiraatPlace[] };

/** The riwayat (numbered 1-20 as in RIWAYAT) of a reader. */
export const riwayatOf = (reader: ReaderId): number[] => RIWAYAT.flatMap((riwaya, i) => (riwaya.reader === reader ? [i + 1] : []));

/** Who the page is narrowed to: a reader, or one of his riwayat. */
export type QiraatFilter = { reader?: ReaderId; riwaya?: number };

/** The riwayat a filter asks for; empty for every reader. */
export const filterRawis = ({ reader, riwaya }: QiraatFilter): number[] => (riwaya ? [riwaya] : reader ? riwayatOf(reader) : []);

/** A filter's name as the page says it: «حمزة», «خلاد». */
export const filterName = ({ reader, riwaya }: QiraatFilter) => (riwaya ? RIWAYAT[riwaya - 1].name : READERS.find(r => r.id === reader)?.name ?? '');

// Without vowels or alifs, so a typed يخادعون finds the page's يُخَٰدِعُونَ (its alif a small one above the letter).
const plain = (text: string) => text.split(/\s+/).map(word => normalizeWord(word).replace(/ا/g, '')).join(' ');

/**
 * The places, narrowed to the words where the filter's riwayat read otherwise than Hafs (a riwaya that reads a word both
 * ways counts), and to a search: a surah's name or a word of any reading, without its vowels.
 */
export function qiraatPlaces(filter: QiraatFilter = {}, query = ''): QiraatSurah[] {
  const rawis = filterRawis(filter);
  const sought = plain(query.trim());
  const out: QiraatSurah[] = [];
  for (const key of qiraatAyat()) {
    const surah = Number(key.split(':')[0]);
    const named = !!sought && plain(surahName(surah)).includes(sought);
    const words = qiraatOf(key).flatMap((word, i) => {
      if (rawis.length && !word.readings.slice(1).some(reading => reading.rawis.some(n => rawis.includes(n)))) return [];
      if (sought && !named && !word.readings.some(reading => plain(reading.text).includes(sought))) return [];
      return [i];
    });
    if (!words.length) continue;
    const last = out.at(-1);
    if (last?.surah === surah) last.places.push({ key, words });
    else out.push({ surah, places: [{ key, words }] });
  }
  return out;
}
