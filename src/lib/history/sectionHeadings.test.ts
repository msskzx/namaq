import { describe, expect, it } from 'vitest';
import { pageHeadings, pageParagraphs } from './sectionHeadings';

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

  it('marks a numbered entry title at the start of a page as a heading', () => {
    const body = ['١ - أَبُو عُبَيْدَةَ بنُ الجَرَّاحِ عَامِرُ بنِ عَبْدِ اللهِ * (م، ق) .', 'ابْنِ الجَرَّاحِ بنِ هِلاَلِ بنِ أُهَيْبِ بنِ ضَبَّةَ.'].join('\n\n');

    expect(pageParagraphs(body)).toEqual([
      { text: '١ - أَبُو عُبَيْدَةَ بنُ الجَرَّاحِ عَامِرُ بنِ عَبْدِ اللهِ * (م، ق) .', heading: true },
      { text: 'ابْنِ الجَرَّاحِ بنِ هِلاَلِ بنِ أُهَيْبِ بنِ ضَبَّةَ.', heading: false },
    ]);
  });
});
