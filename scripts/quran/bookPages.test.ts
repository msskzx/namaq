import { describe, expect, it } from 'vitest';
import { pageBreaks } from './bookPages';

describe('finding printed pages in a book', () => {
  const texts = ['الحمد لله رب العالمين الرحمن الرحيم مالك يوم الدين إياك نعبد وإياك نستعين اهدنا الصراط المستقيم', 'صراط الذين أنعمت عليهم غير المغضوب عليهم ولا الضالين آمين يا رب العالمين'];
  it('starts a page at the word its first letters are in, past a heading the builder dropped', () => {
    const pages = [
      { part: 1, page: 1, text: 'سورة الفاتحة\nالحمد لله رب العالمين الرحمن الرحيم مالك يوم الدين' },
      { part: 1, page: 2, text: 'إياك نعبد وإياك نستعين اهدنا الصراط المستقيم صراط الذين أنعمت عليهم' },
      { part: 1, page: 3, text: 'غير المغضوب عليهم ولا الضالين آمين يا رب العالمين' },
    ];
    const { breaks, lost } = pageBreaks(texts, pages);
    expect(lost).toEqual([]);
    expect(breaks).toEqual([[0, 0, 1, 1], [0, texts[0].indexOf('إياك'), 1, 2], [1, texts[1].indexOf('غير'), 1, 3]]);
  });
  it('joins a page none of whose words are in the book to the page before', () => {
    const { lost } = pageBreaks(texts, [{ part: 1, page: 9, text: 'مقدمة المحقق في وصف النسخ الخطية المعتمدة في التحقيق' }]);
    expect(lost.map(page => page.page)).toEqual([9]);
  });
});
