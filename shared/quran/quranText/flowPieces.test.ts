import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import type { MushafPage } from '../readerPage';
import { ayahWordsOf, HIZB } from './ayahWords';
import { flowPieces } from './flowPieces';

const pages: MushafPage[] = Array.from({ length: 604 }, (_, at) => JSON.parse(readFileSync(join(__dirname, `../../data/quran/mushaf/${at + 1}.json`), 'utf8')));
const words = ayahWordsOf(pages);
const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const num = (n: number) => String(n).replace(/\d/g, d => ARABIC_DIGITS[Number(d)]);
const glued = { text: '\u00a0', glue: true };
const run = (text: string) => ({ text, glue: false });

const surahs = Object.entries(words).reduce<Record<string, [string, readonly string[]][]>>((list, [key, tokens]) => {
  (list[key.split(':')[0]] ??= []).push([key, tokens]);
  return list;
}, {});
const flows = Object.values(surahs).map(ayat => ayat.flatMap(([key, tokens], at) => [...tokens.map((token, i) => run(`${at || i ? ' ' : ''}${token}`)), run(` ${num(Number(key.split(':')[1]))}`)]));

describe('an ayah cut into the pieces a line is made of', () => {
  it('keeps every word and sign of every surah, in order', () => {
    for (const runs of flows) {
      const back = flowPieces(runs, () => glued).flatMap(piece => piece.runs.filter(part => !part.glue).map(part => part.text));
      expect(back).toEqual(runs.map(part => part.text.trim()));
    }
  });

  it('never starts a line with an ayah number, and never leaves a hizb sign at the end of a line', () => {
    const pieces = flows.flatMap(runs => flowPieces(runs, () => glued));
    expect(pieces.length).toBeGreaterThan(0);
    expect(pieces.filter(piece => ARABIC_DIGITS.includes(piece.text[0]) || piece.text.endsWith(HIZB))).toEqual([]);
  });

  it('keeps a sign the books write as its own word on the word before it', () => {
    const signs = ['\u06D6', '\u06DD', '\u06E9', '\uFD3F\u0661\uFD3E', '\u00a0\u0661'];
    for (const sign of signs) expect(flowPieces([run('قُلۡ'), run(` ${sign}`)], () => glued)).toHaveLength(1);
  });

  it('starts a new line only where the text asks for one', () => {
    const pieces = flowPieces([run('قُلۡ هُوَ'), run('\r\nٱللَّهُ أَحَدٌ'), run('\n١')], () => glued);
    expect(pieces.map(piece => [piece.text, piece.newLine])).toEqual([['قُلۡ', false], ['هُوَ', false], ['ٱللَّهُ', true], ['أَحَدٌ', false], ['١', true]]);
  });
});
