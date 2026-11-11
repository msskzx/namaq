import { describe, expect, it } from 'vitest';
import { MUSA } from './musa';
import { buildStory, dotSize, placeIn, placesOf, rangeText, seg, sharedWords, storedText, storyMap } from './story';
import { QURAN_TEXT } from './text';

const events = [
  { phase: 0, title: 'a', segments: [seg(28, 3, 4), seg(20, 37)] },
  { phase: 1, title: 'b', segments: [seg(2, 49)] },
];
const text = storedText({
  names: { 2: 'سُورَةُ البَقَرَةِ', 20: 'سُورَةُ طه', 28: 'سُورَةُ القَصَصِ' },
  ayat: { '28:3': 'نَتۡلُوا۟ عَلَیۡكَ', '28:4': 'إِنَّ فِرۡعَوۡنَ عَلَا', '20:37': 'وَلَقَدۡ مَنَنَّا', '2:49': 'وَإِذۡ نَجَّیۡنَـٰكُم' },
});

describe('buildStory', () => {
  it('gives each event its ayat in order, under the surah name without «سورة»', () => {
    const [first, second] = buildStory(events, text);
    expect(first.segments.map(g => [g.name, g.lines.map(l => l.ayah)])).toEqual([['القصص', [3, 4]], ['طه', [37]]]);
    expect(first.count).toBe(3);
    expect(second.n).toBe(2);
  });

  it('fails instead of showing an event with an ayah missing', () => {
    expect(() => buildStory([{ phase: 0, title: 'a', segments: [seg(28, 3, 5)] }], text)).toThrow(/28:5 is missing/);
  });
});

describe('placesOf', () => {
  it('gathers an event\'s segments by surah, where the surah first comes, in ayah order', () => {
    const [event] = buildStory([{ phase: 0, title: 'a', segments: [seg(28, 4), seg(20, 37), seg(28, 3)] }], text);
    expect(placesOf(event).map(p => [p.surah, p.count, p.segments.map(g => g.range[0])])).toEqual([[28, 2, [3, 4]], [20, 1, [37]]]);
  });
});

describe('storyMap', () => {
  const map = storyMap(buildStory(MUSA.events, QURAN_TEXT));

  it('has a row for each surah that tells part of the story, in mushaf order', () => {
    expect(map.surahs.length).toBe(45);
    expect(map.surahs.map(s => s.surah)).toEqual([...map.surahs.map(s => s.surah)].sort((a, b) => a - b));
    expect(map.surahs[0]).toEqual({ surah: 2, name: 'البقرة' });
    expect(map.surahs[1]).toEqual({ surah: 3, name: 'آل عمران' });
  });

  it('puts every ayah of the story in exactly one place', () => {
    const total = MUSA.events.flatMap(e => e.segments).reduce((t, g) => t + g.range[1] - g.range[0] + 1, 0);
    expect(map.places.flat().reduce((t, p) => t + p.count, 0)).toBe(total);
  });

  it('finds the place of a surah in an event', () => {
    const magicians = MUSA.events.findIndex(e => e.title === 'السحرة يؤمنون');
    expect(placeIn(map, magicians, 20)?.count).toBe(21);
    expect(placeIn(map, magicians, 28)).toBeUndefined();
  });
});

describe('dotSize', () => {
  it('runs from the smallest for one ayah to the largest for the most', () => {
    expect(dotSize(1, 28, 7, 28)).toBe(7);
    expect(dotSize(28, 28, 7, 28)).toBe(28);
    expect(dotSize(7, 28, 7, 28)).toBeGreaterThan(dotSize(4, 28, 7, 28));
  });
});

describe('sharedWords', () => {
  it('marks words in a run of two another surah\'s place also has, not lone words', () => {
    const shared = storedText({ names: { 7: 'الأعراف', 26: 'الشعراء' }, ayat: { '7:109': 'قَالَ ٱلۡمَلَأُ إِنَّ هَـٰذَا لَسَـٰحِرٌ عَلِیمࣱ', '26:34': 'قَالَ لِلۡمَلَإِ إِنَّ هَـٰذَا لَسَـٰحِرٌ' } });
    const [event] = buildStory([{ phase: 0, title: 'a', segments: [seg(7, 109), seg(26, 34)] }], shared);
    const [[[a]], [[b]]] = sharedWords(placesOf(event));
    expect(a).toEqual([false, false, true, true, true, false]);
    expect(b).toEqual([false, false, true, true, true]);
  });
});

describe('rangeText', () => {
  it('writes one ayah alone and a range with a dash', () => {
    expect(rangeText([11, 11])).toBe('١١');
    expect(rangeText([3, 13])).toBe('٣–١٣');
  });
});
