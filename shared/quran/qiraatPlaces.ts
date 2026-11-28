import { normalizeWord } from './normalize';
import { READERS, RIWAYAT, type ReaderId } from './qiraat';
import { qiraatAyat, qiraatOf } from './qiraatData';
import { surahName } from './surahNames';

export type QiraatPlace = { key: string; words: number[] };
export type QiraatSurah = { surah: number; places: QiraatPlace[] };

export const riwayatOf = (reader: ReaderId): number[] => RIWAYAT.flatMap((riwaya, i) => (riwaya.reader === reader ? [i + 1] : []));

export type QiraatFilter = { reader?: ReaderId; riwaya?: number };

export const filterRawis = ({ reader, riwaya }: QiraatFilter): number[] => (riwaya ? [riwaya] : reader ? riwayatOf(reader) : []);

export const filterName = ({ reader, riwaya }: QiraatFilter) => (riwaya ? RIWAYAT[riwaya - 1].name : READERS.find(r => r.id === reader)?.name ?? '');

const plain = (text: string) => text.split(/\s+/).map(word => normalizeWord(word).replace(/ا/g, '')).join(' ');

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
