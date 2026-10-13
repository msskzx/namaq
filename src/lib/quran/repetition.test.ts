import { describe, expect, it } from 'vitest';
import compare from './compare.fixture.json';
import { buildRepetition, type RepetitionInput } from './repetition';
import { findPassages, type AyahInput } from './passages';

const fx = compare as Record<string, string[]>;

const LETTERS = 'ابتثجحخ';
const MORE = 'دذرزسشص';
const word = (prefix: string, i: number) => `${prefix}${LETTERS[i % 7]}${MORE[Math.floor(i / 7) % 7]}`;
const span = (prefix: string, from: number, n: number) => Array.from({ length: n }, (_, k) => word(prefix, from + k));

const shared = span('ك', 0, 12);
const refrain = span('ق', 0, 4);

const input: RepetitionInput = [
  {
    number: 1,
    name: 'Alpha',
    ayat: [
      [...refrain, ...span('ن', 0, 3)].join(' '),
      [...refrain, ...span('ي', 0, 3)].join(' '),
      shared.join(' '),
    ],
  },
  {
    number: 2,
    name: 'Beta',
    ayat: [
      span('ل', 0, 5).join(' '),
      shared.join(' '),
    ],
  },
  {
    number: 3,
    name: 'Gamma',
    ayat: [span('ب', 0, 6).join(' ')],
  },
];

describe('buildRepetition', () => {
  const result = buildRepetition(input);

  it('lists the surahs in input order with their ayah counts', () => {
    expect(result.surahs.map(s => ({ number: s.number, name: s.name, ayat: s.ayat }))).toEqual([
      { number: 1, name: 'Alpha', ayat: 3 },
      { number: 2, name: 'Beta', ayat: 2 },
      { number: 3, name: 'Gamma', ayat: 1 },
    ]);
  });

  it('gives a surah a diagonal cell of len times extra places, and a cross cell of matched words', () => {
    expect(result.cells).toEqual([
      { a: 1, b: 1, words: 4, phrases: 1 },
      { a: 1, b: 2, words: 12, phrases: 1 },
    ]);
  });

  it('sets each surah\'s words to its diagonal value', () => {
    expect(result.surahs.map(s => s.words)).toEqual([4, 0, 0]);
  });

  it('lists the within-surah phrases of surah 1 in findPhrases order', () => {
    expect(result.within).toEqual([
      { surah: 1, text: refrain.join(' '), len: 4, at: [{ ayah: 1, word: 0 }, { ayah: 2, word: 0 }] },
    ]);
  });

  it('lists the cross-surah passage groups', () => {
    expect(result.across).toHaveLength(1);
    expect(result.across[0].matched).toBe(12);
    expect(result.across[0].surahs).toEqual([1, 2]);
  });

  it('returns the findPassages result unchanged', () => {
    const flat: AyahInput[] = [
      ...input[0].ayat.map((text, i) => ({ surah: 1, ayah: i + 1, text })),
      ...input[1].ayat.map((text, i) => ({ surah: 2, ayah: i + 1, text })),
      ...input[2].ayat.map((text, i) => ({ surah: 3, ayah: i + 1, text })),
    ];
    expect(result.passages).toEqual(findPassages(flat));
  });

  it('keys ayat by surah:ayah and holds only ayat that carry a place', () => {
    expect(Object.keys(result.ayat).sort()).toEqual(['1:1', '1:2', '1:3', '2:2']);
    expect(result.ayat['1:3']).toBe(shared.join(' '));
    expect(result.ayat['2:2']).toBe(shared.join(' '));
    expect(result.ayat['1:1']).toBe([...refrain, ...span('ن', 0, 3)].join(' '));
  });

  it('survives a JSON round trip unchanged', () => {
    expect(JSON.parse(JSON.stringify(result))).toEqual(result);
  });
});

describe('buildRepetition basmala', () => {
  const basmalaAyah = fx['7'][0].trim();
  const tokens = basmalaAyah.split(/\s+/);

  it('drops the basmala from ayah 1 of a surah other than 1 and 9', () => {
    const r = buildRepetition([{ number: 7, name: 'A', ayat: [`${basmalaAyah} ${refrain.join(' ')}`, refrain.join(' ')] }]);
    expect(r.ayat['7:1']).toBe([...tokens.slice(4), ...refrain].join(' '));
  });

  it('keeps the basmala in ayah 1 of surah 1', () => {
    const r = buildRepetition([{ number: 1, name: 'A', ayat: [`${basmalaAyah} ${refrain.join(' ')}`, refrain.join(' ')] }]);
    expect(r.ayat['1:1']).toBe([...tokens, ...refrain].join(' '));
  });
});

describe('buildRepetition edge cases', () => {
  it('counts a three-place phrase as len times two on the diagonal', () => {
    const r = buildRepetition([{ number: 5, name: 'A', ayat: [0, 1, 2].map(k => `${refrain.join(' ')} ${span('ن', k * 3, 3).join(' ')}`) }]);
    expect(r.cells).toEqual([{ a: 5, b: 5, words: 8, phrases: 1 }]);
    expect(r.surahs[0].words).toBe(8);
  });

  it('returns empty results for no surahs and for a surah with no ayat', () => {
    expect(buildRepetition([])).toEqual({ surahs: [], cells: [], within: [], across: [], passages: [], ayat: {} });
    const r = buildRepetition([{ number: 4, name: 'A', ayat: [] }]);
    expect(r.surahs).toEqual([{ number: 4, name: 'A', ayat: 0, words: 0 }]);
    expect(r.cells).toEqual([]);
  });

  it('drops the basmala from ayah 1 of surah 7 and keeps the words after it', () => {
    const r = buildRepetition([{ number: 7, name: 'A', ayat: [`${fx['7'][0].trim()} ${refrain.join(' ')}`, refrain.join(' ')] }]);
    expect(r.ayat['7:1']).not.toContain(fx['7'][0].trim().split(/\s+/)[0]);
    expect(r.ayat['7:1']).toContain(refrain.join(' '));
  });
});
