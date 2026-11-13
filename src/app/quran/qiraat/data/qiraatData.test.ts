import { describe, expect, it } from 'vitest';
import { normalizeWord } from '@shared/quran/normalize';
import { qiraatOf } from '@shared/quran/qiraatData';
import { RIWAYAT, riwayatOfReading } from '@/lib/quran/qiraat';
import { variants } from './variants';

// The per-ayah readings (scripts/quran/buildQiraat.ts) against the sourced examples of the qira'at page: each example's
// readings name the same riwayat as the generated data. Left out, with why:
const EXCEPTIONS: Record<string, string> = {
  '40:26': 'the example joins two words the data keeps apart',
  '78:37': 'the example joins two words the data keeps apart',
  '79:10': "the dump drops a shadda in Qalun's reading, so it falls in another group",
  '89:4': "ya' zawa'id, set aside as performance",
  '89:9': "ya' zawa'id, set aside as performance",
  '109:6': "ya' zawa'id, set aside as performance",
};

const skeleton = (text: string) => text.split(/\s+/).map(normalizeWord).join('').replace(/[اوي]/g, '');
const ids = (rawis: number[]) => rawis.map(n => RIWAYAT[n - 1].id).sort();

describe('the per-ayah readings', () => {
  for (const variant of variants) {
    const key = `${variant.surah}:${variant.ayah}`;
    if (EXCEPTIONS[key]) continue;
    it(`agree with the example of ${key}`, () => {
      const word = qiraatOf(key).find(w => skeleton(w.readings[0].text).includes(skeleton(variant.hafsWord)));
      expect(word, `${key} ${variant.hafsWord}`).toBeDefined();
      const groups = word!.readings.map(r => ids(r.rawis).join(','));
      // An example reading that names no one (18:86) has nothing to check.
      for (const reading of variant.readings) if (riwayatOfReading(reading).size) expect(groups).toContain([...riwayatOfReading(reading)].sort().join(','));
    });
  }
});
