import { describe, expect, it } from 'vitest';
import { ayahWords } from './normalize';
import { RIWAYAT, chipStates, neighbors, riwayatOf, riwayatOfReading } from './qiraat';
import { variants } from '@/app/quran/qiraat/data/variants';
import hafs from '@/app/quran/qiraat/data/hafs.fixture.json';

const texts = hafs as Record<string, string>;
const find = (s: number, a: number) => variants.find(v => v.surah === s && v.ayah === a)!;
const stateOf = (s: number, a: number, id: string) => chipStates(find(s, a)).find(c => c.id === id)!.state;

describe('reader to riwaya mapping', () => {
  it('gives every reader two riwayat and every riwaya one reader', () => {
    expect(RIWAYAT).toHaveLength(20);
    expect(riwayatOf('asim')).toEqual(['shuba', 'hafs']);
    expect(riwayatOf('khalaf')).toEqual(['ishaq', 'idris']);
    expect(riwayatOf('hamza')).toEqual(['khalaf-hamza', 'khallad']);
  });

  it('adds single riwayat to the ones a reader brings', () => {
    expect([...riwayatOfReading({ readers: ['nafi'], riwayat: ['hafs'] })]).toEqual(['qalun', 'warsh', 'hafs']);
  });
});

describe('chip coloring', () => {
  it('1:4 puts Asim, both of his riwayat, with the first reading and keeps Khalaf an Hamza apart from Khalaf al-Ashir', () => {
    expect(stateOf(1, 4, 'hafs')).toBe(0);
    expect(stateOf(1, 4, 'shuba')).toBe(0);
    expect(stateOf(1, 4, 'ishaq')).toBe(0);
    expect(stateOf(1, 4, 'khalaf-hamza')).toBe(1);
    expect(stateOf(1, 4, 'warsh')).toBe(1);
  });

  it('5:6 splits Asim: Hafs accusative, Shu\'ba genitive', () => {
    expect(stateOf(5, 6, 'hafs')).toBe(0);
    expect(stateOf(5, 6, 'shuba')).toBe(1);
    expect(stateOf(5, 6, 'qalun')).toBe(0);
    expect(stateOf(5, 6, 'ibn-wardan')).toBe(1);
  });

  it('36:35 splits Asim the other way round on the same riwayat', () => {
    expect(stateOf(36, 35, 'hafs')).toBe(0);
    expect(stateOf(36, 35, 'shuba')).toBe(1);
  });

  it('18:86 names nobody, so every chip is unconfirmed', () => {
    expect(chipStates(find(18, 86)).every(c => c.state === null)).toBe(true);
  });

  it('colors all twenty chips in each variant that has a reader list, with Hafs on the first reading', () => {
    for (const v of variants.filter(x => x.ayah !== 86)) {
      const states = chipStates(v);
      expect(states.every(c => c.state !== null), `${v.surah}:${v.ayah}`).toBe(true);
      expect(states.find(c => c.id === 'hafs')!.state).toBe(0);
    }
  });

  it('never lists a riwaya on both readings', () => {
    for (const v of variants) {
      const [a, b] = v.readings.map(riwayatOfReading);
      expect([...a].filter(id => b.has(id)), `${v.surah}:${v.ayah}`).toEqual([]);
    }
  });
});

describe('neighbors', () => {
  const norm = (s: number, a: number) => ayahWords(texts[`${s}:${a}`], false).norm;
  const around = (s: number, a: number) => {
    const v = find(s, a);
    const words = ayahWords(texts[`${s}:${a}`], false);
    const at = neighbors(words.norm, v.hafsWord, v.occurrence)!;
    return { at, text: (r: readonly [number, number]) => words.display.slice(r[0], r[1]).length };
  };

  it('finds the intended Hafs word in all twelve entries', () => {
    const expected: Record<string, string> = { '1:4': 'مَـٰلِكِ', '2:9': 'یَخۡدَعُونَ', '2:132': 'وَوَصَّىٰ', '2:259': 'نُنشِزُهَا', '3:146': 'قَـٰتَلَ', '5:6': 'وَأَرۡجُلَكُمۡ', '9:100': 'تَحۡتَهَا', '17:93': 'قُلۡ', '18:86': 'حَمِئَةࣲ', '36:35': 'عَمِلَتۡهُ', '43:19': 'عِبَـٰدُ', '49:6': 'فَتَبَیَّنُوۤا۟' };
    for (const v of variants) {
      const k = `${v.surah}:${v.ayah}`;
      const at = neighbors(norm(v.surah, v.ayah), v.hafsWord, v.occurrence)!;
      expect(ayahWords(texts[k], false).display.slice(at.start, at.end).join(' '), k).toBe(expected[k]);
    }
  });

  it('1:4 has the word first, so only the two words after it', () => {
    const { at } = around(1, 4);
    expect(at.start).toBe(0);
    expect(at.before).toEqual([0, 0]);
    expect(at.after).toEqual([1, 3]);
  });

  it('5:6 takes two words on each side', () => {
    const { at } = around(5, 6);
    expect(at.before[1] - at.before[0]).toBe(2);
    expect(at.after[1] - at.after[0]).toBe(2);
    expect(norm(5, 6)[at.start - 1]).toBe('برءوسكم');
  });

  it('2:9 picks the second يخدعون by occurrence and the first by default', () => {
    expect(around(2, 9).at.start).toBe(5);
    expect(neighbors(norm(2, 9), 'يخدعون')!.start).toBe(0);
  });

  it('returns null for a word the ayah lacks', () => {
    expect(neighbors(norm(1, 4), 'كتاب')).toBeNull();
  });
});
