// docs/plans/quran-qiraat.md
import { normalizeWord } from '@shared/quran/normalize';
import { READERS, RIWAYAT, type ReaderId, type RiwayaId } from '@shared/quran/qiraat';

export { READERS, RIWAYAT, type ReaderId, type RiwayaId };

export type Reading = {
  text?: string;
  readers?: ReaderId[];
  riwayat?: RiwayaId[];
};

export type Meaning =
  | { kind: 'quote'; quotes: string[]; source: string; url: string }
  | { kind: 'unsourced'; text: string }
  | { kind: 'withheld'; text: string };

export type Variant = {
  surah: number;
  ayah: number;
  hafsWord: string;
  occurrence?: number;
  readings: Reading[];
  note?: string;
  meaning?: Meaning;
};

export type ChipState = number | null;

export const riwayatOf = (reader: ReaderId): RiwayaId[] => RIWAYAT.filter(r => r.reader === reader).map(r => r.id);

export function riwayatOfReading(reading: Reading): Set<RiwayaId> {
  return new Set([...(reading.readers ?? []).flatMap(riwayatOf), ...(reading.riwayat ?? [])]);
}

export function chipStates(variant: Variant): { id: RiwayaId; name: string; state: ChipState }[] {
  const sets = variant.readings.map(riwayatOfReading);
  return RIWAYAT.map(({ id, name }) => {
    const hits = sets.flatMap((set, i) => (set.has(id) ? [i] : []));
    return { id, name, state: hits.length === 1 ? hits[0] : null };
  });
}

export function neighbors(norm: string[], target: string, occurrence = 0, radius = 2) {
  const wanted = target.split(' ').map(normalizeWord);
  let seen = 0;
  for (let start = 0; start + wanted.length <= norm.length; start++) {
    if (!wanted.every((w, k) => norm[start + k] === w)) continue;
    if (seen++ < occurrence) continue;
    const end = start + wanted.length;
    return { start, end, before: [Math.max(0, start - radius), start] as const, after: [end, Math.min(norm.length, end + radius)] as const };
  }
  return null;
}
