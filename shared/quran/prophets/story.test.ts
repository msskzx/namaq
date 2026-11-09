import { describe, expect, it } from 'vitest';
import { buildStory, seg, storedText } from './story';

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
