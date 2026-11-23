import { describe, expect, it } from 'vitest';
import sadi from '../../data/quran/tafsirSadi.json';
import kashshaf from '../../data/quran/kashshaf.js';
import mufradat from '../../data/quran/mufradat.js';
import corpus from '../quranText/corpus';
import { DARK_SEA_READINGS, DARK_SEA_STEPS, darkSeaWords, shotOf, wordsPage } from './darkSea';

const pageWords = new Map(corpus.ayat.map(ayah => [ayah.key, ayah.words]));
const sayings = DARK_SEA_STEPS.flatMap(step => step.sayings);

describe('the dark sea scene (an-Nur 40)', () => {
  it('walks the whole ayah in order, its words read off the mushaf page', () => {
    const words = darkSeaWords(key => pageWords.get(key));
    const steps = words.map(word => word.step);
    expect(steps.every((step, i) => step >= 0 && (i === 0 || step >= steps[i - 1]))).toBe(true);
    // Every page with a phrase lights words of its own; the ayah ends on the last of them (owner, 2026-11-22).
    const phrased = DARK_SEA_STEPS.flatMap((step, page) => (step.phrase ? [page] : []));
    expect([...new Set(steps)]).toEqual(phrased);
    expect(DARK_SEA_STEPS[steps[steps.length - 1]].layer).toBe('end');
  });

  it('keeps a page that goes on with its shot\'s dot', () => {
    DARK_SEA_STEPS.forEach((step, page) => { if (step.more) expect(shotOf(page)).toBe(shotOf(page - 1)); });
    expect(DARK_SEA_STEPS[wordsPage(DARK_SEA_STEPS.length - 1)].layer).toBe('end');
  });

  // Owner, 2026-11-22: al-Sa'di's darknesses come piece by piece as each layer goes out, and stay his words in his order.
  it('splits a saying only into its own words, in order', () => {
    for (const step of DARK_SEA_STEPS) if (step.parts) expect(step.parts.join(' ')).toBe(step.sayings[0].text);
  });

  // Every naming of the darknesses is still shown, after the end (owner, 2026-11-22).
  it('shows every reading of the darknesses', () => {
    for (const reading of DARK_SEA_READINGS) expect(sayings).toContain(reading);
  });

  // Owner, 2026-11-21: attributed sayings only, never «قيل».
  it('links every line to its book\'s page, and never says «قيل»', () => {
    for (const saying of sayings) {
      expect(saying.source.url, saying.text).toMatch(/^https:\/\//);
      expect(saying.text).not.toMatch(/(^|[\s«(])[وف]?قيل/);
    }
  });

  // FIX ONLY FROM A SOURCE: a quote from a book the app holds is found in it word for word, on that ayah.
  it('quotes al-Sa\'di, al-Kashshaf and al-Raghib word for word', () => {
    const sadiText = (sadi.passages as unknown as [number, number, number, number, number, string][])
      .filter(([surah, from, to]) => surah === 24 && from <= 40 && 40 <= to).map(passage => passage[5]).join('\n');
    const kashshafText = kashshaf.entries.filter(entry => entry[0] === 24 && entry[1] <= 40 && 40 <= entry[2]).map(entry => String(entry[6])).join('\n');
    const raghibText = mufradat.entries.filter(entry => entry[0] === 'لج').map(entry => entry[4]).join('\n');
    const held: Record<string, string> = { 'السعدي': sadiText, 'الزمخشري': kashshafText, 'الراغب الأصفهاني': raghibText };
    const checked = sayings.filter(saying => saying.by in held);
    expect(checked.length).toBeGreaterThan(0);
    for (const saying of checked) expect(held[saying.by], saying.text).toContain(saying.text);
  });
});
