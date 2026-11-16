import { describe, expect, it } from 'vitest';
import { kashshafAt, kashshafCredit, kashshafPage, kashshafRuns, litWords, type KashshafData } from './kashshaf';

const text = 'قوله ﴿وَاشْتَعَلَ﴾ فيه. شبه الشيب بالنار في ﴿الرَّأْسُ﴾ استعارة. آخر.';
const start = text.indexOf('شبه');
const end = text.indexOf('آخر') - 1;
const data: KashshafData = {
  source: { version: 'v', book: 346, from: '' },
  entries: [[19, 2, 6, 3, 4, 5, text, [[start, end, 1, 4, 7, 7], [start, end, 0, 4, 7, 7]]], [19, 7, 7, 3, 6, 6, 'كلام.', []]],
};

describe("al-Kashshaf's passages in the reader", () => {
  it('finds the passage that holds an ayah, and none where the book has none', () => {
    expect(kashshafAt(data, '19:4')?.from).toBe(2);
    expect(kashshafAt(data, '19:7')?.text).toBe('كلام.');
    expect(kashshafAt(data, '20:1')).toBeNull();
  });

  it('draws a lit sentence apart, its devices named once in front, its quotes in the Quran font', () => {
    const runs = kashshafRuns(kashshafAt(data, '19:4')!);
    const lit = runs.filter(run => run.lit !== null);
    expect(lit.map(run => run.text).join('')).toBe(text.slice(start, end));
    expect(lit.filter(run => run.opens)).toHaveLength(1);
    expect(lit[0].devices).toEqual(['التشبيه', 'الاستعارة']);
    expect(runs.filter(run => run.quran).map(run => run.text)).toEqual(['﴿وَاشْتَعَلَ﴾', '﴿الرَّأْسُ﴾']);
    expect(runs.map(run => run.text).join('')).toBe(text);
  });

  it('lights ayah words only on the ayah the sentence quotes', () => {
    const passage = kashshafAt(data, '19:4')!;
    expect(litWords(passage, 0, '19:4')).toEqual([7, 7]);
    expect(litWords(passage, 0, '19:5')).toBeNull();
  });

  it('credits volume and pages, and links the first page', () => {
    const passage = kashshafAt(data, '19:4')!;
    expect(kashshafCredit(passage)).toBe('الكشاف للزمخشري ٣/٤–٥');
    expect(kashshafPage(passage)).toBe('https://quranpedia.net/book/346/3/4');
  });
});
