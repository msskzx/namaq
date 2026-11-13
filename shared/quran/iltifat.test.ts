import { describe, expect, it } from 'vitest';
import data from '../data/quran/iltifat.json';
import { EXAMPLES, examples, letterDiff, resolve, shareText, type Line, type Voice } from './iltifat';
import { ayahWords } from './normalize';

const views = examples();
const view = (surah: number) => views.find(v => v.surah === surah)!;
const wordsOf = (key: string) => ayahWords((data.ayat as Record<string, string>)[key], false).display;
const collapse = (voices: Voice[]) => voices.filter((v, i) => v !== voices[i - 1]);
const textOf = (lines: Line[]) => lines.flatMap(line => line.words.map(w => w.text));

describe('iltifat examples', () => {
  it('are the seven examples the page had, in mushaf order', () => {
    expect(views.map(v => v.key)).toEqual(['1:2', '10:22', '12:80', '17:1', '35:9', '43:22', '48:8']);
  });

  it('has the text of every ayah each example covers', () => {
    for (const e of EXAMPLES) for (let a = e.from; a <= e.to; a++) expect(data.ayat).toHaveProperty([`${e.surah}:${a}`]);
  });

  it('shows every word of a strip card, and its voices change in the order of its chips', () => {
    for (const v of views) {
      if (v.kind !== 'strip') continue;
      expect(textOf(v.lines)).toEqual(Array.from({ length: v.to - v.from + 1 }, (_, k) => wordsOf(`${v.surah}:${v.from + k}`)).flat());
      const marked = v.lines.flatMap(line => line.words.flatMap(w => (w.voice ? [w.voice] : [])));
      expect(collapse(marked), v.key).toEqual(collapse(v.steps.map(s => s.voice)));
    }
  });

  it('colours the turn of al-Fatiha at إياك', () => {
    const v = view(1);
    if (v.kind !== 'strip') throw new Error('strip');
    expect(v.lines.find(l => l.ayah === 5)!.words.map(w => w.voice)).toEqual(['you', undefined, 'you', undefined]);
  });

  it('puts Yusuf 80-83 back together from its turns, every word once and in order', () => {
    const v = view(12);
    if (v.kind !== 'dialog') throw new Error('dialog');
    const lines = v.turns.flatMap(t => ('narration' in t ? t.narration : 'lines' in t ? t.lines : []));
    expect(textOf(lines)).toEqual([80, 81, 82, 83].flatMap(a => wordsOf(`12:${a}`)));
    expect(lines.filter(l => l.end).map(l => l.ayah)).toEqual([80, 81, 82, 83]);
  });

  it('has the brothers say to their father what the eldest told them to say', () => {
    const v = view(12);
    if (v.kind !== 'dialog') throw new Error('dialog');
    const bubbles = v.turns.flatMap(t => ('who' in t ? [t] : []));
    const told = bubbles[0].lines.at(-1)!.words.at(-1)!;
    expect(told.voice).toBe('we');
    expect(bubbles[1]).toMatchObject({ said: true, voice: 'we' });
    expect(v.turns.findIndex(t => 'cut' in t)).toBeGreaterThan(v.turns.indexOf(bubbles[0]));
    expect(v.turns.findIndex(t => 'cut' in t)).toBeLessThan(v.turns.indexOf(bubbles[1]));
  });

  it('grows al-Zukhruf 22-23 from one shared phrase into two words that differ in one letter', () => {
    const v = view(43);
    if (v.kind !== 'tree') throw new Error('tree');
    expect(wordsOf('43:22').join(' ')).toContain(v.trunk);
    expect(wordsOf('43:23').join(' ')).toContain(v.trunk);
    const [a, b] = letterDiff(v.leaves[0].word, v.leaves[1].word);
    expect([a[1][0], b[1][0]]).toEqual(['ه', 'ق']);
    expect(a[0] + a[1] + a[2]).toBe(v.leaves[0].word);
    expect(b[0] + b[1] + b[2]).toBe(v.leaves[1].word);
  });

  it('names each tree leaf by its speaker words in the ayah', () => {
    const v = view(43);
    if (v.kind !== 'tree') throw new Error('tree');
    for (const leaf of v.leaves) expect(ayahWords(wordsOf(`43:${leaf.ayah}`).join(' '), false).norm.join(' ')).toContain(ayahWords(leaf.who, false).norm.join(' '));
  });

  it('places a phrase only when it occurs once', () => {
    const norm = ['قال', 'لهم', 'قال'];
    expect(resolve(norm, ['لهم', 'he'])).toEqual([1]);
    expect(() => resolve(norm, ['قال', 'he'])).toThrow();
    expect(resolve(norm, ['قال', 'he', 'لهم قال'])).toEqual([2]);
    expect(() => resolve(norm, ['ليس', 'he'])).toThrow();
  });

  it('shares the ayat and the place, with no link', () => {
    const text = shareText(view(17));
    expect(text).toContain('الإسراء ١');
    expect(text).not.toMatch(/https?:/);
  });
});
