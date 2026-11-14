import { describe, expect, it } from 'vitest';
import { parseSurahTopics, rangeGaps } from './surahTopicsParse';

const cite = (vol: number, page: number, title = 'التفسير الموضوعي لسور القرآن الكريم') => `<p>ينظر: "${title}" لمجموعة من العلماء (${vol} /${page}).</p>`;

describe('parseSurahTopics', () => {
  it('reads numbered headings, ranges and the volume and page, and drops the opening sentence', () => {
    const html = `<p>جاءت موضوعات السورة كما يلي:</p><p> 1. تساؤل المشركين عن النبأ (١-٥).</p><p>2. الآيات الكونية (٦-١٦).</p>${cite(9, 4)}`;
    expect(parseSurahTopics(html)).toEqual({ volume: 9, page: 4, sections: [
      { title: 'تساؤل المشركين عن النبأ', from: 1, to: 5 }, { title: 'الآيات الكونية', from: 6, to: 16 },
    ] });
  });

  it('is null for a note that cites another book, or none', () => {
    expect(parseSurahTopics('<p>أولًا: الألوهيَّة.</p><p>"تيسير الكريم الرَّحمن" للسعدي (ص17).</p>')).toBeNull();
    expect(parseSurahTopics('')).toBeNull();
  });

  it('nests headings inside a wider range, splits two on one line, and keeps a heading with no number', () => {
    const html = `<p>هداية القرآن (١-٣٩).</p><p>موقف الناس منها (١-٢٠).</p><p>أمر الناس (٢١- ٣٩). بنو إسرائيل (٤٠-١٦٢).تذكير وعتاب (٤٠-٤٨).</p>${cite(1, 19, 'التفسير الموضوعي')}`;
    expect(parseSurahTopics(html)!.sections).toEqual([
      { title: 'هداية القرآن', from: 1, to: 39, parts: [{ title: 'موقف الناس منها', from: 1, to: 20 }, { title: 'أمر الناس', from: 21, to: 39 }] },
      { title: 'بنو إسرائيل', from: 40, to: 162, parts: [{ title: 'تذكير وعتاب', from: 40, to: 48 }] },
    ]);
  });

  it('puts a parent listed after its parts above them, items with no range under the one before, and "*" lines over theirs', () => {
    const after = parseSurahTopics(`<p>قصة نوح (٥٩-٦٤).</p><p>قصة هود (٦٥-٧٢).</p><p>أقوام الأنبياء (٥٩-٧٢).</p>${cite(3, 9)}`)!;
    expect(after.sections.map(s => [s.title, s.parts?.length])).toEqual([['أقوام الأنبياء', 2]]);
    const tabuk = parseSurahTopics(`<p>5. غزوة تبوك (٣٨- ١٢٧).</p><p>6. أصناف أهل الزكاة.</p><p>7. علو مكانة النبي (١٢٨-١٢٩).</p>${cite(3, 178)}`)!;
    expect(tabuk.sections[0]).toEqual({ title: 'غزوة تبوك', from: 38, to: 127, parts: [{ title: 'أصناف أهل الزكاة' }] });
    const groups = parseSurahTopics(`<p>* قوانين ربانية {وَمَا اْلنَّصْرُ}:</p><p>1. غزوة بدر (٥-١٤).</p><p>* قوانين مادية:</p><p>2. من شروط النصر (٤٥-٤٩).</p>${cite(3, 131)}`)!;
    expect(groups.sections).toEqual([
      { title: 'قوانين ربانية {وَمَا اْلنَّصْرُ}', parts: [{ title: 'غزوة بدر', from: 5, to: 14 }] },
      { title: 'قوانين مادية', parts: [{ title: 'من شروط النصر', from: 45, to: 49 }] },
    ]);
  });

  it('joins a range on its own line to the heading above and ignores what follows the citation', () => {
    const html = `<p>عباد الله المخلصين</p><p>  (٧٥-١٤٨).</p>${cite(6, 347)}<p>ويقول شيخ الإسلام (١-٢).</p>`;
    expect(parseSurahTopics(html)!.sections).toEqual([{ title: 'عباد الله المخلصين', from: 75, to: 148 }]);
  });
});

describe('rangeGaps', () => {
  it('names ayat no heading covers and ayat two cover, inside parts too, counting a shared range once', () => {
    expect(rangeGaps([{ title: 'أ', from: 1, to: 5 }, { title: 'ب', from: 7, to: 15 }, { title: 'ج', from: 16, to: 25 }], 1, 25)).toEqual(['6–6 not in any heading']);
    expect(rangeGaps([{ title: 'أ', from: 1, to: 30 }, { title: 'ب', from: 29, to: 38 }], 1, 38)).toEqual(['29–30 in two headings']);
    expect(rangeGaps([{ title: 'أ', from: 1, to: 10, parts: [{ title: 'ب', from: 1, to: 4 }, { title: 'ج', from: 6, to: 10 }] }], 1, 10)).toEqual(['inside «أ»: 5–5 not in any heading']);
    expect(rangeGaps([{ title: 'أ', from: 1, to: 9 }, { title: 'ب', from: 1, to: 9 }], 1, 9)).toEqual([]);
  });
});
