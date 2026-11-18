import { describe, expect, it } from 'vitest';
import { authorText, headingsFor, letters, meaningOf, meaningPicks, quotesOf, readGharib, readMufradat } from './gharib';

const page = (id: number, text: string, at = id) => ({ id, text, vol: '1', page: at });

describe("Ibn Qutaybah's text", () => {
  it("keeps the author's words: no notes below the rule, no note calls, no tags", () => {
    expect(authorText('﴿رَيْبَ﴾ أي شك (١) .<br>_________\n(١) حاشية المحقق')).toBe('﴿رَيْبَ﴾ أي شك.');
  });

  it('opens an entry on a numbered line or a quote and runs on over the lines after it', () => {
    const entries = readGharib([page(36, 'سورة الحمد\n٢- ﴿الْحَمْدُ لِلَّهِ﴾ الشكر.\nو﴿رَبِّ﴾ المالك.\nقال الشاعر: بيت\nسورة البقرة\n٢- ﴿لا رَيْبَ﴾ لا شك فيه.')]);
    expect(entries.map(({ surah, from, numbered, text }) => [surah, from, numbered, text])).toEqual([
      [1, 2, true, '٢- ﴿الْحَمْدُ لِلَّهِ﴾ الشكر.'],
      [1, 2, false, 'و﴿رَبِّ﴾ المالك.\nقال الشاعر: بيت'],
      [2, 2, true, '٢- ﴿لا رَيْبَ﴾ لا شك فيه.'],
    ]);
  });

  it('reads the quotes on the first line, or a word in parentheses', () => {
    expect(quotesOf('٣١- و (الأَبُّ) المَرْعَى.')).toEqual(['الأَبُّ']);
    expect(quotesOf('﴿مَاءً ثَجَّاجًا﴾ أي سَيَّالا.')).toEqual(['مَاءً ثَجَّاجًا']);
  });
});

describe('«ما معنى؟» meanings', () => {
  const one = (text: string) => meaningOf({ text, places: [[14, 3, 4]] });

  it('takes a short meaning of his own', () => {
    expect(one('﴿مَاءً ثَجَّاجًا﴾ أي سَيَّالا.')).toBe('أي سَيَّالا.');
  });

  it('takes his first sentence when more follows, and an addition to the ayah', () => {
    expect(one('﴿مَاءً﴾ أي سيالا. وأصله من الثج.')).toBe('أي سيالا.');
    expect(one('﴿مَاءً﴾ أي سيالا. وفيه قول آخر: كثيرا.')).toBeNull();
    expect(one('﴿مَاءً﴾ في الأرحام.')).toBe('في الأرحام.');
    expect(one('﴿مَاءً﴾ يقال: سيالا.')).toBe('سيالا.');
  });

  it('leaves out alternatives, pointers elsewhere and notes on the word', () => {
    expect(one('﴿مَاءً﴾ يقال: كذا، ويقال: كذا.')).toBeNull();
    expect(one('﴿مَاءً﴾ قد تقدم تفسيره.')).toBeNull();
    expect(one('﴿مَاءً﴾ واحدها كذا.')).toBeNull();
    expect(one('﴿مَاءً﴾ أي سيالا. ويقال: كثيرا.')).toBeNull();
    expect(one('﴿مَاءً﴾ سيالا، ويقال: كثيرا.')).toBeNull();
    expect(one('﴿مَاءً﴾ سيالا. وقيل أيضا: كثيرا.')).toBeNull();
    expect(one('﴿مَاءً﴾ سيالا. ويقال: هو من ثج [إذا سال]: كثيرا.')).toBeNull();
  });

  it('keeps his meaning when what follows shows the word in use', () => {
    expect(one('﴿مَاءً﴾ أي عادلون، يقال: نكب عن الحق: أي عدل عنه.')).toBe('أي عادلون');
    expect(one('﴿مَاءً﴾ أي سيالا. ويقال: ثج الماء: إذا سال.')).toBe('أي سيالا.');
    expect(meaningOf({ text: '﴿مَاءً﴾ أي سيالا.', places: [[14, -1, -1]] })).toBeNull();
    expect(meaningOf({ text: '﴿مَاءً﴾ يقال: سيالا.\nوقيل: كذا', places: [[14, 3, 3]] })).toBeNull();
  });

  it("offers three of his other meanings from the same surah, never one that shares the right one's words", () => {
    const entry = (ayah: number, quote: string, meaning: string, surah = 78) => ({ surah, text: `﴿${quote}﴾ ${meaning}`, places: [[ayah, 0, 0]] as [number, number, number][], quote });
    const picks = meaningPicks([
      entry(14, 'ثجاجا', 'أي منصب.'), entry(13, 'وهاجا', 'أي وقادا.'), entry(34, 'دهاقا', 'أي مترعة.'),
      entry(16, 'ألفافا', 'أي ملتفة.'), entry(20, 'سرابا', 'أي منصب جدا.'), entry(5, 'فراتا', 'أي عذبا.', 77),
    ]);
    const first = picks.find(pick => pick.asked === 0)!;
    expect(first.others).toHaveLength(3);
    expect(first.others).not.toContain(4);
  });

  it('never offers a meaning of a word from the same root', () => {
    const entry = (ayah: number, quote: string, meaning: string, roots: string[]) => ({ surah: 72, text: `﴿${quote}﴾ ${meaning}`, places: [[ayah, 0, 0]] as [number, number, number][], quote, roots });
    const picks = meaningPicks([
      entry(6, 'رهقا', 'أي ضلالا.', ['رهق']), entry(7, 'ولا رهقا', 'أي ظلما.', ['رهق']), entry(4, 'سفيهنا', 'جاهلنا.', ['سفه']),
      entry(12, 'ظننا', 'أي استيقنا.', ['ظنن']), entry(14, 'القاسطون', 'الجائرون.', ['قسط']), entry(2, 'الرشد', 'الصواب.', ['رشد']),
    ]);
    expect(picks.find(pick => pick.asked === 0)!.others).not.toContain(1);
  });
});

describe("al-Raghib's articles", () => {
  it('starts at the first book division, keeps headings of their own line, and joins an ayah reference to its quote', () => {
    const entries = readMufradat([
      page(1, 'مقدمة المحقق\nكلام'),
      page(2, '<span data-type="title" id=toc-1>كتاب الثاء</span>\n<span data-type="title" id=toc-2>ثجَ</span>\nيقال: ثَجَّ الماء «٥» . قال تعالى: ماءً ثَجَّاجًا\n[النبأ/ ١٤]', 172),
    ]);
    expect(entries).toEqual([['ثجَ', 172, 172, 2, 'يقال: ثَجَّ الماء. قال تعالى: ماءً ثَجَّاجًا [النبأ/ ١٤]']]);
  });

  it("finds a corpus root's heading, its doubled letter once and a weak letter as alif, never across و and ي", () => {
    const headings = new Map(['ثج', 'دعا', 'كان', 'نسي', 'يد'].map((heading, at) => [letters(heading), [at]]));
    expect(headingsFor('ثجج', headings)).toEqual([0]);
    expect(headingsFor('دعو', headings)).toEqual([1]);
    expect(headingsFor('كون', headings)).toEqual([2]);
    expect(headingsFor('نسو', headings)).toEqual([]);
    expect(headingsFor('يدي', headings)).toEqual([4]);
  });
});
