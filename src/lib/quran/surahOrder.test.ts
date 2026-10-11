import { describe, expect, it } from 'vitest';
import data from '@/app/quran/order/ayat.json';
import { resolve } from './curatedShifts';
import { ayahWords } from './normalize';
import { buildOrder, HOPS, sharedThemes, THEMES, TOPICS, TOPICS_SRC, type SurahTopics } from './surahOrder';

const count = (n: number) => data.counts[String(n) as keyof typeof data.counts];
const norm = (key: string) => ayahWords(data.ayat[key as keyof typeof data.ayat], false).norm;

describe('HOPS', () => {
  it('covers every neighbouring pair from 46 to 113 once, in order', () => {
    expect(HOPS.map(h => h.from)).toEqual(Array.from({ length: 68 }, (_, k) => 46 + k));
  });

  it('keeps each range ordered, at most five ayat, inside its surah', () => {
    for (const h of HOPS) {
      for (const [n, [from, to]] of [[h.from, h.tail], [h.from + 1, h.head]] as const) {
        expect(from).toBeGreaterThanOrEqual(1);
        expect(to).toBeGreaterThanOrEqual(from);
        expect(to - from).toBeLessThan(5);
        expect(to).toBeLessThanOrEqual(count(n));
      }
    }
  });

  it('has a note on every hop, and a titled http source where one is given', () => {
    for (const h of HOPS) {
      expect(h.note.length).toBeGreaterThan(0);
      for (const s of h.src) expect(s.url.startsWith('https://') && s.title.length > 0).toBe(true);
    }
  });

  it('sources the hops whose page was read', () => {
    expect(HOPS.filter(h => h.src.length).map(h => h.from)).toEqual([93, 105, 107, 113]);
  });

  it('finds each shared phrase once in both ayat it names', () => {
    const shared = HOPS.flatMap(h => (h.shared ?? []).map(s => ({ h, s })));
    expect(shared.length).toBeGreaterThan(0);
    for (const { h, s: [phrase, a, b] } of shared) {
      for (const words of [norm(`${h.from}:${a}`), norm(`${h.from + 1}:${b}`)]) expect(resolve(words, [phrase, 'third'])).toHaveLength(phrase.split(' ').length);
    }
  });
});

describe('TOPICS', () => {
  it('covers every surah from 46 to 114 with one to six topics', () => {
    expect(Object.keys(TOPICS).map(Number)).toEqual(Array.from({ length: 69 }, (_, k) => 46 + k));
    for (const { topics } of Object.values(TOPICS)) {
      expect(topics.length).toBeGreaterThanOrEqual(1);
      expect(topics.length).toBeLessThanOrEqual(6);
    }
  });

  it('has a focus on every juz 30 surah and on none before it', () => {
    for (const [n, { focus }] of Object.entries(TOPICS)) expect(Boolean(focus)).toBe(Number(n) >= 78);
  });

  it('uses only known themes, once per surah, with no repeated detail', () => {
    for (const { topics } of Object.values(TOPICS)) {
      expect(topics.every(([t, d]) => t in THEMES && d.length > 0)).toBe(true);
      expect(new Set(topics.map(([t]) => t)).size).toBe(topics.length);
      expect(new Set(topics.map(([, d]) => d)).size).toBe(topics.length);
    }
  });

  it('keeps about twelve themes, each carried by two surahs or more and none by all', () => {
    expect(Object.keys(THEMES).length).toBeLessThanOrEqual(12);
    for (const id of Object.keys(THEMES)) {
      const n = Object.values(TOPICS).filter(t => t.topics.some(([u]) => u === id)).length;
      expect(n).toBeGreaterThanOrEqual(2);
      expect(n).toBeLessThan(69);
    }
  });

  it('has a topicLink on every hop and cites the focus source', () => {
    expect(HOPS.every(h => h.topicLink.length > 0)).toBe(true);
    expect(TOPICS_SRC.url.startsWith('https://')).toBe(true);
  });

  it('derives the themes a surah shares with the next', () => {
    const table: Record<number, SurahTopics> = {
      1: { focus: '', topics: [['a', 'x'], ['b', 'y'], ['c', 'z']] },
      2: { focus: '', topics: [['c', 'p'], ['a', 'q']] },
    };
    expect(sharedThemes(table, 1)).toEqual(['a', 'c']);
    expect(sharedThemes(table, 2)).toEqual([]);
  });
});

describe('buildOrder', () => {
  const { chips, hops } = buildOrder(data);

  it('lists one chip per surah from 46 to 114 with its name', () => {
    expect(chips.map(c => c.number)).toEqual(Array.from({ length: 69 }, (_, k) => 46 + k));
    expect(chips.every(c => c.plain.length > 0)).toBe(true);
  });

  it('colors the shared word on both sides with the same slot', () => {
    const hop = hops.find(h => h.hop.from === 109)!;
    const color = (lines: typeof hop.tail) => lines.flatMap(l => (l.slots ? l.text.split(' ').flatMap((w, i) => (i in l.slots! ? [[w, l.slots![i]]] : [])) : []));
    expect(color(hop.tail).map(([, slot]) => slot)).toEqual([1]);
    expect(color(hop.head).map(([, slot]) => slot)).toEqual([1]);
    expect(hop.words.map(w => ayahWords(w, false).norm[0])).toEqual(['دين']);
  });

  it('puts the derived shared themes on the hop', () => {
    const hop = hops.find(h => h.hop.from === 112)!;
    expect(hop.common).toEqual(['prophet', 'tawhid', 'denial'].filter(t => TOPICS[113].topics.some(([u]) => u === t)));
    expect(hop.common).toEqual(['prophet', 'tawhid']);
  });

  it('keeps the basmala out of the first ayah of a surah', () => {
    const first = hops.find(h => h.hop.from === 112)!.tail[0];
    expect(first.text.startsWith('قُلۡ')).toBe(true);
  });
});
