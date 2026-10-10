import { describe, expect, it } from 'vitest';
import fixture from './compare.fixture.json';
import { alignSurahs, clampRange, groupPairs, wordSlots, type Block } from './compare';
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
    for (const a of [76, 78, 79]) {
      expect(at(a).marksA).toEqual(norm(56)[a - 1].map((_, k) => k));
      expect(at(a).marksB).toEqual(norm(69)[at(a).b - 1].map((_, k) => k));
    }
    expect(at(80).marksA).toEqual([]);
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

const pairsOf = (n: number, m: number) => blocksOf(n, m).filter(b => b.kind === 'words').flatMap(b => b.pairs);
const links = (n: number, m: number) => pairsOf(n, m).map(p => `${p.a}:${p.b}`);

describe('alignSurahs on Al-Hadid and At-Taghabun', () => {
  it('pairs 64:1 with both 57:1 and 57:2, each backed by a shared run', () => {
    const pairs = pairsOf(57, 64);
    const run = (a: number, b: number) => pairs.find(p => p.a === a && p.b === b)?.run;
    expect(run(1, 1)).toBeGreaterThanOrEqual(2);
    expect(run(2, 1)).toBeGreaterThanOrEqual(2);
  });

  it('shows 64:1 once, as a group of two links', () => {
    const groups = blocksOf(57, 64).flatMap(b => groupPairs(b.pairs));
    const group = groups.find(g => g.bs.includes(1))!;
    expect(group.as).toEqual([1, 2]);
    expect(group.bs).toEqual([1]);
    const every = groups.flatMap(g => g.bs);
    expect(new Set(every).size).toBe(every.length);
  });
});

describe('repeated counterparts', () => {
  it('add nothing to the pairs of Al-Hijr and Sad', () => {
    expect(new Set(links(15, 38).map(l => l.split(':')[0])).size).toBe(links(15, 38).length);
    expect(new Set(links(15, 38).map(l => l.split(':')[1])).size).toBe(links(15, 38).length);
  });

  it('add only 7:123 and 7:124 against 26:49 to Al-A\'raf and Ash-Shu\'ara', () => {
    const seen = new Map<string, number>();
    for (const l of links(7, 26)) for (const [k, v] of [['a', l.split(':')[0]], ['b', l.split(':')[1]]]) seen.set(k + v, (seen.get(k + v) ?? 0) + 1);
    expect([...seen].filter(([, n]) => n > 1).map(([k]) => k)).toEqual(['b49']);
  });
});

describe('groupPairs and wordSlots', () => {
  const pair = (a: number, b: number, marksA: number[], marksB: number[]) => ({ a, b, run: 2, shared: [], marksA, marksB });
  const group = groupPairs([pair(1, 1, [0, 1], [2]), pair(2, 1, [3], [0, 3]), pair(3, 2, [], [])])[0];

  it('joins pairs that share an ayah and starts a new group when none is shared', () => {
    expect(groupPairs([pair(1, 1, [], []), pair(2, 1, [], []), pair(3, 2, [], [])]).map(g => [g.as, g.bs])).toEqual([[[1, 2], [1]], [[3], [2]]]);
  });

  it('gives each link its own slot, and a word shared with two links the first slot', () => {
    expect(wordSlots(group, 'b', 1, 4)).toEqual({ 0: 0, 1: 0, 3: 0, 2: 1 });
  });

  it('gives a counterpart the slot of its link', () => {
    expect(wordSlots(group, 'a', 2, 4)).toEqual({ 0: 1, 1: 1, 2: 1 });
  });
});

describe('ranges within one surah', () => {
  const slice = (from: number, to: number) => norm(55).slice(from - 1, to);
  const rows = alignSurahs(slice(46, 61), slice(62, 77), { a: 46, b: 62 }, false);

  it('pairs 55:46-61 with 55:62-77 in 16 parallel steps and adds no count block', () => {
    expect(rows).toHaveLength(1);
    const block = rows[0].type === 'block' ? rows[0].block : null;
    expect(block?.kind).toBe('words');
    expect(block?.pairs.map(p => [p.a, p.b])).toEqual(Array.from({ length: 16 }, (_, k) => [46 + k, 62 + k]));
  });

  it('shares the refrain across the odd steps in full', () => {
    const block = rows[0].type === 'block' ? rows[0].block : null;
    expect(block?.pairs.filter(p => p.a % 2 === 1).every(p => p.run === 4 && p.marksA.length === 0)).toBe(true);
  });

  it('keeps real ayah numbers when the ranges start late and the count block is on', () => {
    const real = alignSurahs(slice(46, 61), slice(62, 77), { a: 46, b: 62 });
    expect(real.flatMap(r => (r.type === 'block' ? r.block.pairs.map(p => p.a) : [])).every(a => a >= 46 && a <= 61)).toBe(true);
  });
});

describe('clampRange', () => {
  it('defaults to the whole surah', () => {
    expect(clampRange(undefined, undefined, 77)).toEqual({ from: 1, to: 77 });
  });

  it('clamps to the ayat count and keeps from at or below to', () => {
    expect(clampRange('0', '500', 77)).toEqual({ from: 1, to: 77 });
    expect(clampRange('60', '10', 77)).toEqual({ from: 60, to: 60 });
    expect(clampRange('x', '12', 77)).toEqual({ from: 1, to: 12 });
  });
});

describe('alignSurahs edge cases', () => {
  it('lets a surah shorter than the tail take a shorter tail and gaps the rest', () => {
    const rows = alignSurahs([['a'], ['b']], [['c'], ['d'], ['e']]);
    expect(rows.map(r => r.type)).toEqual(['gap', 'block']);
    expect(rows[1].type === 'block' && rows[1].block.pairs.length).toBe(2);
  });

  it('keeps the anchors before the tail when a block reaches into it', () => {
    const rows = alignSurahs(norm(56), norm(56));
    const words = rows.flatMap(r => (r.type === 'block' && r.block.kind === 'words' ? [r.block] : []));
    expect(words.length).toBeGreaterThan(0);
    expect(words.every(b => last(b).a < 92)).toBe(true);
  });
});
