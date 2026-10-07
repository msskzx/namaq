// docs/adr/0027-a-date-is-read-from-its-quote-and-the-number-is-checked.md
import { describe, it, expect } from 'vitest';
import { readNumber, readYear, readMonth, readDay, dateReaders, dateParts, dateTag } from './dateReader';

describe('readNumber', () => {
  const cases: Array<[string, number | undefined]> = [
    ['سَنَةَ سِتٍّ وَثَلاَثِيْنَ', 36],
    ['ثَمَانَ عَشْرَةَ', 18],
    ['ثمان وخمسين', 58],
    ['أَرْبَعٌ وَسِتُّوْنَ سَنَةً', 64],
    ['مِائَةٍ', 100],
    ['مِائَتَيْنِ', 200],
    ['وَمِائَةٍ وَعَشْرٍ', 110],
    ['ثلاثمائة', 300],
    ['٣٦', 36],
    ['أَسْلَمَ وَهُوَ حَدَثٌ، لَهُ سِتَّ عَشْرَةَ سَنَةً', 16],
    ['أَسْلَمَ الزُّبَيْرُ ابْنُ ثَمَانِ سِنِيْنَ', 8],
    ['ابْنُ اثْنَتَي عَشْرَةَ سَنَةً', 12],
    ['بِضْعٌ وَخَمْسُوْنَ سَنَةً', undefined],
    ['سنة ست أو سبع', undefined],
    ['رَجَبٍ', undefined],
    ['', undefined],
    ['أَحَدَ عَشَرَ', 11],
    ['اثْنَا عَشَرَ', 12],
    ['ثَلاَثَ عَشْرَةَ', 13],
    ['إِحْدَى وَعِشْرِيْنَ', 21],
    ['مِائَةٍ وَثَلاَثٍ وَعِشْرِيْنَ', 123],
    ['ثَلاَثِمائَةٍ وَخَمْسٍ وَسِتِّيْنَ', 365],
    ['خَمْسٍ وَعِشْرِيْنَ وَمِائَةٍ', 125],
    ['ثَلاَثَ مِائَةٍ', 300],
    ['سِتَّ مِئَةٍ', 600],
    ['ثَلاَثاً وَسِتِّيْنَ', 63],
    ['ثِنْتَيْنِ وَسَبْعِيْنَ', 72],
    ['أَلْفٍ وَمِائَتَيْنِ', undefined],
    ['كَانَ أَحَدَ العَشَرَةِ', undefined],
    ['خَمْسٍ وَسِتِّيْنَ وَسِتِّيْنَ', undefined],
    ['عِشْرِيْنَ وَثَلاَثٍ', undefined],
    ['سِتٍّ وَسَبْعٍ', undefined],
  ];

  it.each(cases)('readNumber(%j) = %j', (input, expected) => {
    expect(readNumber(input)).toBe(expected);
  });
});

describe('readYear', () => {
  const cases: Array<[string, number | undefined]> = [
    ['سَنَةَ سِتٍّ وَثَلاَثِيْنَ', 36],
    ['قبل الهجرة بسنة', -1],
    ['قبل الهجرة بسنتين', -2],
    ['قبل الهجرة بثلاث سنين', -3],
    ['قبل المبعث بعشر سنين', undefined],
    ['بعد بدر بسنة', undefined],
    ['قبل الهجرة بعام', -1],
    ['قبل الهجرة بعامين', -2],
    ['قبل الهجرة بثلاث وعشرين سنة', -23],
    ['قبل الهجرة بسنة وأشهر', undefined],
    ['قبل الهجرة بنحو سنة', undefined],
  ];

  it.each(cases)('readYear(%j) = %j', (input, expected) => {
    expect(readYear(input)).toBe(expected);
  });
});

describe('readMonth', () => {
  const cases: Array<[string, number | undefined]> = [
    ['رَجَبٍ', 7],
    ['فِي رَمَضَانَ', 9],
    ['المحرم', 1],
    ['ذي الحجة', 12],
    ['ذو القعدة', 11],
    ['ربيع الآخر', 4],
    ['ربيع الأول', 3],
    ['جمادى الآخرة', 6],
    ['جمادى الأولى', 5],
    ['جمادى الثانية', 6],
    ['صفر', 2],
    ['شعبان', 8],
    ['شوال', 10],
    ['ربيع', undefined],
    ['رجب ورمضان', undefined],
    ['سنة ست', undefined],
    ['للمحرم', 1],
    ['بمحرم', 1],
    ['ذي القعدة وذي الحجة', undefined],
    ['جمادى الأولى والآخرة', undefined],
    ['في ربيع الأول من السنة الأولى', undefined],
  ];

  it.each(cases)('readMonth(%j) = %j', (input, expected) => {
    expect(readMonth(input)).toBe(expected);
  });
});

describe('readDay', () => {
  const cases: Array<[string, number | undefined]> = [
    ['13', 13],
    ['الثالث عشر', 13],
    ['العاشر', 10],
    ['الحادي والعشرين', 21],
    ['الثلاثين', 30],
    ['العشرين', 20],
    ['لعشر خلون', undefined],
    ['لعشر بقين', undefined],
    ['النصف', undefined],
    ['أول', undefined],
    ['آخر', undefined],
    ['45', undefined],
    ['الثاني عشر', 12],
    ['الحادي والثلاثين', undefined],
    ['في ربيع الأول', undefined],
    ['الثاني عشر والعشرين', undefined],
  ];

  it.each(cases)('readDay(%j) = %j', (input, expected) => {
    expect(readDay(input)).toBe(expected);
  });
});

describe('dateReaders registry', () => {
  it('has a reader for exactly the expected predicates', () => {
    const expected = new Set([
      'born.year',
      'died.year',
      'islam.age',
      'born.month',
      'died.month',
      'born.day',
      'died.day',
    ]);
    const actual = new Set(Object.keys(dateReaders));
    expect(actual).toEqual(expected);
  });

  it('born.year and died.year use readYear', () => {
    expect(dateReaders['born.year']).toBe(readYear);
    expect(dateReaders['died.year']).toBe(readYear);
  });

  it('islam.age uses readNumber', () => {
    expect(dateReaders['islam.age']).toBe(readNumber);
  });

  it('born.month and died.month use readMonth', () => {
    expect(dateReaders['born.month']).toBe(readMonth);
    expect(dateReaders['died.month']).toBe(readMonth);
  });

  it('born.day and died.day use readDay', () => {
    expect(dateReaders['born.day']).toBe(readDay);
    expect(dateReaders['died.day']).toBe(readDay);
  });
});

describe('dateParts map', () => {
  it('maps dates to their containing parts', () => {
    expect(dateParts['died.day']).toBe('died.month');
    expect(dateParts['died.month']).toBe('died.year');
    expect(dateParts['born.day']).toBe('born.month');
    expect(dateParts['born.month']).toBe('born.year');
  });

  it('does not have entries for year predicates or other predicates', () => {
    expect(dateParts['died.year']).toBeUndefined();
    expect(dateParts['born.year']).toBeUndefined();
    expect(dateParts['islam.age']).toBeUndefined();
    expect(dateParts['name.full']).toBeUndefined();
  });
});

describe('fail-closed readings from the second review', () => {
  it.each([
    ['readDay', readDay, 'الخامس والسادس'],
    ['readDay', readDay, 'الثالث والعشرين والرابع'],
    ['readDay', readDay, 'الثالث والرابع عشر'],
    ['readNumber', readNumber, 'ثلاث مئين'],
    ['readNumber', readNumber, 'سبعين سنة ونصف'],
    ['readNumber', readNumber, '3٥'],
    ['readYear', readYear, 'نحو سبعين سنة'],
    ['readYear', readYear, 'سنة 35 تقريبا'],
    ['readYear', readYear, 'قبل الهجرة بسنة ونصف'],
    ['readYear', readYear, 'قبل الهجرة بسنة وشهرين'],
  ] as const)('%s(%j) gives no reading', (_name, read, input) => {
    expect(read(input)).toBeUndefined();
  });

  it('reads a hundred joined by و as a sum, not a product', () => {
    expect(readNumber('ثلاث ومائة')).toBe(103);
  });
});

describe('dateTag', () => {
  it.each([
    ['قُتِلَ فِي رَجَبٍ، سَنَةَ سِتٍّ وَثَلاَثِيْنَ', 'time-layer:waiting'],
    ['وَهَاجَرَ وَهُوَ ابْنُ ثَمَانِ عَشْرَةَ سَنَةً', 'time-layer:waiting'],
    ['لِعَشْرٍ خَلَوْنَ مِنْ رَمَضَانَ', 'time-layer:unreadable'],
    ['عَاشَ سَبْعِيْنَ سَنَةً وَنِصْفاً', 'time-layer:unreadable'],
    ['وَهُوَ ابْنُ ثَلاَثِيْنَ', 'time-layer:waiting'],
    ['وَرَوَى أَحَادِيْثَ يَسِيْرَةً', undefined],
    ['أَخْبَرَنَا فُلاَنٌ، حَدَّثَنَا فُلاَنٌ', undefined],
  ] as const)('tags %j as %j', (text, expected) => {
    expect(dateTag(text)).toBe(expected);
  });
});

