import { describe, expect, it } from 'vitest';
import { authorsWords, chaptersOf, surahOfHeading } from './mutashabihBooks';

// Lines as the editions print them (Turath 1340, 1419, 3580); the book reader shows the author's words only (AGENTS.md).
describe("the author's words", () => {
  it("takes out the editor's references, ayah numbers and entry numbers and keeps every word of the author's", () => {
    expect(authorsWords('عَلَيْنَا نَصِيرًا) (الإسراء: ٧٥)، (ثم) قال')).toBe('عَلَيْنَا نَصِيرًا)، (ثم) قال');
    expect(authorsWords('(وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ (٣) وَمِنْ شَرِّ النَّفَّاثَاتِ)')).toBe('(وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ وَمِنْ شَرِّ النَّفَّاثَاتِ)');
    expect(authorsWords('(ادخلوا هذه القرية..) البقرة ٥٨، وتعقبه بقوله')).toBe('(ادخلوا هذه القرية..)، وتعقبه بقوله');
    expect(authorsWords('وقال في سورة الرعد ٣٧: (ولئن اتبعت')).toBe('وقال في سورة الرعد: (ولئن اتبعت');
    expect(authorsWords('وَمثله فِي الرَّعْد ٤ والنحل ١٢ والنور ٦١')).toBe('وَمثله فِي الرَّعْد والنحل والنور');
    expect(authorsWords('٥٨٧- قَوْله تَعَالَى (تبت يدا)')).toBe('قَوْله تَعَالَى (تبت يدا)');
    expect(authorsWords('أخرجوهم) وفي النمل ٥٦: (فما كان')).toBe('أخرجوهم) وفي النمل: (فما كان');
    expect(authorsWords('(ومن قوم موسى..) ليكون آخر٥/ب الكلام')).toBe('(ومن قوم موسى..) ليكون آخر الكلام');
  });

  it("takes out his footnotes, his insertions in square brackets and his «ينظر» notes", () => {
    expect(authorsWords('مَا قَدَّمَتْ لِغَدٍ) .\n_________\n(١) اللهيف: المضطر (اللسان ٣٢٢١٩) .')).toBe('مَا قَدَّمَتْ لِغَدٍ).');
    expect(authorsWords('وقد أطنب أبو الفضل ابن الخطيب [الرازى]- ﵀ - فى التفسير')).toBe('وقد أطنب أبو الفضل ابن الخطيب- ﵀ - فى التفسير');
    expect(authorsWords('على نسق واحد. (ينظر: البرهان للكرماني: ١٥٢، كشف المعاني لابن جماعة: ١٣٤) .')).toBe('على نسق واحد.');
    expect(authorsWords('نحو قول الشاعر [برج بن مسهر الطائى]:\nوندمان يزيد')).toBe('نحو قول الشاعر:\nوندمان يزيد');
  });

  it('keeps a verse the author quotes in square brackets, without the brackets', () => {
    expect(authorsWords('من قول الأخطل:\n[نفسي فداء أمير المؤمنين إذا أبدى التواجد يوم باسل ذكر]\nومهلهل:'))
      .toBe('من قول الأخطل:\nنفسي فداء أمير المؤمنين إذا أبدى التواجد يوم باسل ذكر\nومهلهل:');
  });
});

describe('the surah a chapter heading names', () => {
  it('reads the names the books use beside the mushaf’s, the shared ones by the book’s order', () => {
    expect(surahOfHeading('سورة براءة', 8)).toBe(9);
    expect(surahOfHeading('سورة بني إسرائيل (الإسراء)', 16)).toBe(17);
    expect(surahOfHeading('سورة المؤمن', 39)).toBe(40);
    expect(surahOfHeading('سورة السجدة', 40)).toBe(41);
    expect(surahOfHeading('سورة القلم', 95)).toBe(96);
    expect(surahOfHeading('سُورَة ألم نشرح', 93)).toBe(94);
    expect(surahOfHeading('سووة التين', 94)).toBe(95);
    expect(surahOfHeading('الشمس والليل والضحى', 90)).toBe(91);
  });

  it("gives the author's preface no surah", () => {
    expect(surahOfHeading('مقدمة المؤلف', 0)).toBe(0);
    expect(surahOfHeading('بِسم الله الرَّحْمَن الرَّحِيم وَبِه ثقتي', 0)).toBe(0);
  });
});

describe('chapters and pages', () => {
  const title = (id: number, text: string) => `<span data-type="title" id=toc-${id}>${text}</span>`;

  it('starts a chapter at each top heading and keeps each printed page where it starts', () => {
    const { chapters, breaks } = chaptersOf([
      { vol: '1', page: 7, text: `الحمد لله.\n${title(1, 'سورة البقرة')}\nقوله (ذلك الكتاب)` },
      { vol: '1', page: 8, text: `لا ريب فيه\n${title(2, 'الآية الثانية')}\nقوله` },
    ], [1, 2]);
    expect(chapters.map(chapter => chapter.surah)).toEqual([0, 2]);
    expect(chapters[1].text).toContain('الآية الثانية');
    expect(breaks.map(([chapter, at, part, page]) => [chapters[chapter].text.slice(at, at + 6), part, page])).toEqual([['الحمد ', 1, 7], ['لا ريب', 1, 8]]);
  });

  it('takes out a reference that a page break cuts in two', () => {
    const { chapters } = chaptersOf([
      { vol: '1', page: 7, text: `${title(1, 'سورة الإسراء')}\nنَصِيرًا) (الإسراء:` },
      { vol: '1', page: 8, text: '٧٥)، (ثم) قال' },
    ], [1]);
    expect(chapters[0].text).not.toMatch(/الإسراء:|\(\s*\)/);
    expect(chapters[0].text).toContain('(ثم) قال');
  });
});
