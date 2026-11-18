import { describe, expect, it } from 'vitest';
import { skeleton } from './irabUkbari';
import { firstWords, headingName, placeQuotes, readParagraphs, type MushafWord } from './itqanBalagha';

const page = (id: number, page: number, text: string) => ({ id, page, vol: '3', text });

describe("al-Suyuti's headings", () => {
  it('names the device a heading names, without «فصل» or «النوع ...»', () => {
    expect(headingName('فصل: ومن أقسامه النهي')).toBe('النهي');
    expect(headingName('النَّوْعُ الرَّابِعُ عَشَرَ: الِالْتِفَاتُ')).toBe('الِالْتِفَاتُ');
    expect(headingName('الِاسْتِعَارَةُ.')).toBe('الِاسْتِعَارَةُ');
  });

  it('names nothing for a note or a rule', () => {
    expect(headingName('تَنْبِيهٌ')).toBeNull();
    expect(headingName('قَاعِدَةٌ')).toBeNull();
  });
});

describe('his paragraphs', () => {
  const kind = 'النَّوْعُ الثَّامِنُ وَالْخَمْسُونَ: فِي بَدَائِعِ الْقُرْآنِ';
  const long = (n: number) => `هذا كلام طويل له في الباب يذكر فيه الشاهد رقم ${n} ويشرحه شرحا وافيا.`;

  it('opens a kind on its title and puts paragraphs under the heading before them, a note keeping the device', () => {
    const { paragraphs, kinds } = readParagraphs([page(1, 10, `<span data-type="title" id=toc-1>${kind}</span>\nالِالْتِفَاتُ\n${long(1)}\nتَنْبِيهٌ\n${long(2)}`)]);
    expect(kinds[58]).toBe(kind);
    expect(paragraphs.map(p => [p.kind, p.heading])).toEqual([[58, 'الِالْتِفَاتُ'], [58, 'الِالْتِفَاتُ']]);
  });

  it('reads short lines in a row as verse, not headings', () => {
    const { paragraphs } = readParagraphs([page(1, 10, `${kind}\nالتَّوْرِيَةُ\n${long(1)}\nبيت من الشعر قصير\nوعجزه قصير مثله\n${long(2)}`)]);
    expect(paragraphs.every(p => p.heading === 'التَّوْرِيَةُ')).toBe(true);
    expect(paragraphs.some(p => p.text === 'بيت من الشعر قصير')).toBe(true);
  });

  it('joins a paragraph a page broke in two, and keeps its pages', () => {
    const { paragraphs } = readParagraphs([page(1, 10, `${kind}\n${long(1)}`), page(2, 11, long(2))]);
    expect(paragraphs).toHaveLength(1);
    expect([paragraphs[0].first, paragraphs[0].last, paragraphs[0].id]).toEqual([10, 11, 1]);
  });
});

describe('placing his quotes', () => {
  // Two surahs: «الحمد لله» stands in both, «رب العالمين» only in the first.
  const words = [[1, 1, 'الحمد لله رب العالمين'], [1, 2, 'الرحمن الرحيم'], [2, 1, 'الحمد لله الذي'], [2, 2, 'الحمد لله الذي']] as const;
  const mushaf: MushafWord[] = words.flatMap(([surah, ayah, text]) => text.split(' ').map((word, at) => ({ surah, ayah, at, skeleton: skeleton(word) })));
  const first = firstWords(mushaf);

  it('places a quote that fits one place there', () => {
    expect(placeQuotes('قال ﴿رَبِّ الْعَالَمِينَ﴾', mushaf, first)).toEqual([[1, 1, 2, 3, 1, 0]]);
  });

  it("places a quote that fits several by the paragraph's other quotes", () => {
    expect(placeQuotes('﴿الْحَمْدُ لِلَّهِ﴾ ثم ﴿الرَّحْمَنِ الرَّحِيمِ﴾', mushaf, first)).toEqual([[1, 1, 0, 1, 1, 0], [1, 2, 0, 1, 1, 1]]);
  });

  it('places a quote with nothing to choose on every one of its places, with their count, however many', () => {
    expect(placeQuotes('﴿الْحَمْدُ لِلَّهِ﴾', mushaf, first).map(place => place[4])).toEqual([3, 3, 3]);
    const many: MushafWord[] = Array.from({ length: 40 }, (_, at) => ({ surah: 3, ayah: at + 1, at: 0, skeleton: skeleton('سبحانه') }));
    expect(placeQuotes('﴿سُبْحَانَهُ﴾', many, firstWords(many))).toHaveLength(40);
  });
});
