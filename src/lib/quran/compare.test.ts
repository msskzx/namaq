import { describe, expect, it } from 'vitest';
import fixture from './compare.fixture.json';
import { alignSurahs, type Block } from './compare';
import { ayahWords } from './normalize';

const fx = fixture as Record<string, string[]>;
const norm = (n: number) => fx[n].map((t, i) => ayahWords(t, i === 0).norm);
const last = (b: Block) => b.pairs[b.pairs.length - 1];
const range = (b: Block) => `${b.pairs[0].a}-${last(b).a}~${b.pairs[0].b}-${last(b).b}`;
const blocksOf = (n: number, m: number) => alignSurahs(norm(n), norm(m)).flatMap(r => (r.type === 'block' ? [r.block] : []));

describe("alignSurahs on Al-Waqi'ah and Al-Haqqah", () => {
  const rows = alignSurahs(norm(56), norm(69));
  const blocks = blocksOf(56, 69);

  it('finds the word-backed block 56:75-80 ~ 69:38-43', () => {
    const block = blocks.find(b => b.kind === 'words')!;
    expect(range(block)).toBe('75-80~38-43');
    expect(block.anchors).toBe(2);
    const at = (a: number) => block.pairs.find(p => p.a === a)!;
    expect(at(80).run).toBe(4);
    expect(at(75).shared).toEqual(expect.arrayContaining(['فلا', 'اقسم']));
    expect(at(77).shared).toEqual(expect.arrayContaining(['انه', 'كريم']));
    expect(at(77).run).toBeLessThan(2);
    for (const a of [76, 78, 79]) expect(at(a).shared).toEqual([]);
  });

  it('puts the end of both surahs in a count block, with 56:96 ~ 69:52 sharing four words', () => {
    const tail = blocks.find(b => b.kind === 'count')!;
    expect(range(tail)).toBe('92-96~48-52');
    expect(tail.pairs.map(p => p.run)).toEqual([0, 0, 0, 1, 4]);
    expect(tail.pairs[3].shared).toEqual(['اليقين']);
    expect(tail.pairs.slice(0, 3).every(p => p.shared.length === 0)).toBe(true);
  });

  it('collapses what lies between blocks', () => {
    const gaps = rows.flatMap(r => (r.type === 'gap' ? [`${r.a?.from}-${r.a?.to}~${r.b?.from}-${r.b?.to}`] : []));
    expect(gaps).toEqual(['1-74~1-37', '81-91~44-47']);
  });
});

describe('alignSurahs on Al-Hijr and Sad', () => {
  it('finds a block inside 15:28-40 ~ 38:71-83', () => {
    const found = blocksOf(15, 38).filter(b => b.kind === 'words');
    expect(found.some(b => b.pairs[0].a >= 28 && last(b).a <= 40 && b.pairs[0].b >= 71 && last(b).b <= 83)).toBe(true);
  });
});

describe('alignSurahs edge cases', () => {
  it('lets a surah shorter than the tail take a shorter tail and gaps the rest', () => {
    const rows = alignSurahs([['a'], ['b']], [['c'], ['d'], ['e']]);
    expect(rows.map(r => r.type)).toEqual(['gap', 'block']);
    expect(rows[1].type === 'block' && rows[1].block.pairs.length).toBe(2);
  });
});
