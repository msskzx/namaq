import { describe, expect, it } from 'vitest';
import { findPassageParagraph, pageHeadings, pageParagraphs } from './sectionHeadings';

describe('pageHeadings', () => {
  it('reads a bracketed paragraph as a heading, brackets stripped', () => {
    const body = ['بسم الله الرحمن الرحيم', '[ذكر نسب سيد البشر:]', 'محمد رسول الله.'].join('\n\n');

    expect(pageHeadings(body)).toEqual([{ paragraphIndex: 1, text: 'ذكر نسب سيد البشر' }]);
  });

  it('strips a doubled bracket, as used for the book title', () => {
    const body = '[[السيرة النبوية]]';

    expect(pageHeadings(body)).toEqual([{ paragraphIndex: 0, text: 'السيرة النبوية' }]);
  });

  it('ignores a paragraph that only mentions a bracket in passing', () => {
    const body = ['فقال: [كذا وكذا] في حديثه.', 'نص آخر لا علاقة له.'].join('\n\n');

    expect(pageHeadings(body)).toEqual([]);
  });

  it('finds more than one heading on the same page', () => {
    const body = ['[الباب الأول:]', 'نص.', '[الباب الثاني:]', 'نص آخر.'].join('\n\n');

    expect(pageHeadings(body).map((heading) => heading.text)).toEqual(['الباب الأول', 'الباب الثاني']);
  });

  it('returns nothing for a page with no headings', () => {
    expect(pageHeadings('نص عادي بلا عناوين.')).toEqual([]);
  });

  it('marks headings for the reader and removes their brackets', () => {
    expect(pageParagraphs('[إسلام ضماد:]\n\nنص الخبر.')).toEqual([
      { text: 'إسلام ضماد', heading: true },
      { text: 'نص الخبر.', heading: false },
    ]);
  });

  it('leaves an ordinary numbered paragraph as body text', () => {
    expect(pageParagraphs('١ - ثم ساروا إلى المدينة.')).toEqual([
      { text: '١ - ثم ساروا إلى المدينة.', heading: false },
    ]);
  });

  it('recognizes numbered entry titles ending with an asterisk marker', () => {
    expect(pageParagraphs('٢ - حَمْزَةُ بنُ عَبْدِ المُطَّلِبِ **')).toEqual([
      { text: '٢ - حَمْزَةُ بنُ عَبْدِ المُطَّلِبِ **', heading: true },
    ]);
  });

  it('marks a numbered entry title at the start of a page as a heading', () => {
    const body = ['١ - أَبُو عُبَيْدَةَ بنُ الجَرَّاحِ عَامِرُ بنِ عَبْدِ اللهِ * (م، ق) .', 'ابْنِ الجَرَّاحِ بنِ هِلاَلِ بنِ أُهَيْبِ بنِ ضَبَّةَ.'].join('\n\n');

    expect(pageParagraphs(body)).toEqual([
      { text: '١ - أَبُو عُبَيْدَةَ بنُ الجَرَّاحِ عَامِرُ بنِ عَبْدِ اللهِ * (م، ق) .', heading: true },
      { text: 'ابْنِ الجَرَّاحِ بنِ هِلاَلِ بنِ أُهَيْبِ بنِ ضَبَّةَ.', heading: false },
    ]);
  });
});

describe('findPassageParagraph', () => {
  const body = [
    '١ - أَبُو عُبَيْدَةَ بنُ الجَرَّاحِ عَامِرُ بنُ عَبْدِ اللهِ * (م، ق) .',
    'ابْنِ الجَرَّاحِ بنِ هِلاَلِ بنِ أُهَيْبِ بنِ ضَبَّةَ (١) .',
    'يَجْتَمِعُ فِي النَّسَبِ هُوَ وَالنَّبِيُّ.',
  ].join('\n\n');

  it('finds the paragraph holding the cited excerpt', () => {
    expect(findPassageParagraph(body, 'أَبُو عُبَيْدَةَ بنُ الجَرَّاحِ')).toBe(0);
    expect(findPassageParagraph(body, 'يَجْتَمِعُ فِي النَّسَبِ')).toBe(2);
  });

  it('matches across whitespace and the editor footnote markers', () => {
    expect(findPassageParagraph(body, 'ابْنِ الجَرَّاحِ بنِ هِلاَلِ')).toBe(1);
  });

  it('returns -1 when the excerpt matches nothing or is empty', () => {
    expect(findPassageParagraph(body, 'نص غير موجود')).toBe(-1);
    expect(findPassageParagraph(body, '   ')).toBe(-1);
  });
});
