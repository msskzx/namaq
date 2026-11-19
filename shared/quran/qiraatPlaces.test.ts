import { describe, expect, it } from 'vitest';
import { qiraatAyat, qiraatOf } from './qiraatData';
import { filterName, qiraatPlaces, riwayatOf } from './qiraatPlaces';

const keys = (list: ReturnType<typeof qiraatPlaces>) => list.flatMap(s => s.places.map(p => p.key));

describe('qiraatPlaces: the «القراءات» page', () => {
  it('lists every place, in the mushaf order, under its surah', () => {
    const all = qiraatPlaces();
    expect(keys(all)).toEqual(qiraatAyat());
    expect(all[0]).toEqual({ surah: 1, places: [{ key: '1:4', words: [0] }, ...all[0].places.slice(1)] });
    expect(all.every((s, i) => !i || s.surah > all[i - 1].surah)).toBe(true);
  });

  it("narrows to the words a reader reads otherwise than Hafs (Hamza's فأزالهما, not 2:9 where he reads as Hafs)", () => {
    const hamza = qiraatPlaces({ reader: 'hamza' });
    const baqara = hamza.find(s => s.surah === 2)!.places;
    expect(baqara.find(p => p.key === '2:36')?.words).toEqual([0]);
    expect(baqara.some(p => p.key === '2:9')).toBe(false);
    for (const { key, words } of hamza.flatMap(s => s.places)) {
      for (const i of words) expect(qiraatOf(key)[i].readings.slice(1).some(r => r.rawis.some(n => riwayatOf('hamza').includes(n)))).toBe(true);
    }
  });

  it('narrows to one riwaya', () => {
    expect(filterName({ riwaya: 12 })).toBe('خلاد');
    const khallad = keys(qiraatPlaces({ riwaya: 12 }));
    expect(khallad.length).toBeGreaterThan(0);
    expect(khallad.every(key => keys(qiraatPlaces({ reader: 'hamza' })).includes(key))).toBe(true);
  });

  it('finds a word without its vowels, and a surah by name', () => {
    expect(keys(qiraatPlaces({}, 'يخادعون'))).toContain('2:9');
    expect(qiraatPlaces({}, 'الفاتحة').map(s => s.surah)).toEqual([1]);
  });
});
