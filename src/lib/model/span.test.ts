import { describe, expect, it } from 'vitest';
import { matchForm, renderSpan, resolveSpan } from './span';

const NAME = 'الزُّبَيْرُ بنُ العَوَّامِ بنِ خُوَيْلِدِ بنِ أَسَدِ بنِ عَبْدِ العُزَّى';

describe('matchForm', () => {
  it('drops footnote markers and collapses whitespace', () => {
    expect(matchForm('لَهُ سِتَّ (٢) عَشْرَةَ\n\n  سَنَةً')).toBe('لَهُ سِتَّ عَشْرَةَ سَنَةً');
  });

  it('keeps harakat, hamza and sigla significant', () => {
    expect(matchForm('أَسَدٍ * (ع)')).toBe('أَسَدٍ * (ع)');
    expect(matchForm('أَسَدٍ')).not.toBe(matchForm('اسد'));
  });
});

describe('resolveSpan', () => {
  const body = 'قَالَ فُلَانٌ كَذَا وَكَذَا (١) وَقَالَ فُلَانٌ كَذَا وَكَذَا.\n\nثُمَّ ذَهَبَ إِلَى الْمَدِينَةِ.';

  it('rejects a quote that occurs twice', () => {
    expect(() => resolveSpan(body, { exact: 'قَالَ فُلَانٌ كَذَا وَكَذَا' })).toThrow(/2 times/);
  });

  it('rejects a quote that occurs nowhere', () => {
    expect(() => resolveSpan(body, { exact: 'لَيْسَ فِي الصَّفْحَةِ أَبَدًا' })).toThrow(/0 times/);
  });

  it('rejects a short quote with no context', () => {
    expect(() => resolveSpan(body, { exact: 'الْمَدِينَةِ' })).toThrow(/prefix or suffix/);
  });

  it('uses a prefix to choose between repeats', () => {
    const span = { exact: 'قَالَ فُلَانٌ كَذَا وَكَذَا', prefix: 'وَ' };
    expect(renderSpan(body, span)).toBe('قَالَ فُلَانٌ كَذَا وَكَذَا');
    expect(resolveSpan(body, span).start).toBeGreaterThan(body.indexOf('(١)'));
  });

  it('renders a span across a paragraph break as one run', () => {
    const span = { exact: 'وَكَذَا. ثُمَّ ذَهَبَ إِلَى الْمَدِينَةِ.' };
    expect(renderSpan(body, span)).toBe('وَكَذَا. ثُمَّ ذَهَبَ إِلَى الْمَدِينَةِ.');
  });
});

describe('resolveSpan edges', () => {
  it('counts base letters only for the 12-letter rule', () => {
    const body = 'ابتثجحخدذرزس ابتثجحخدذرز';
    expect(() => resolveSpan(body, { exact: 'ابتثجحخدذرز' })).toThrow(/prefix or suffix/);
    expect(resolveSpan(body, { exact: 'ابتثجحخدذرزس' })).toEqual({ start: 0, end: 12 });
  });

  it('uses a suffix to choose between repeats', () => {
    const body = 'قَالَ فُلَانٌ كَذَا وَكَذَا ثُمَّ سَكَتَ. قَالَ فُلَانٌ كَذَا وَكَذَا ثُمَّ ذَهَبَ.';
    const span = { exact: 'قَالَ فُلَانٌ كَذَا وَكَذَا', suffix: 'ثُمَّ ذَهَبَ' };
    expect(resolveSpan(body, span).start).toBeGreaterThan(body.indexOf('سَكَتَ'));
  });

  it('excludes footnote markers at the edges of the quote', () => {
    const body = 'قَبْلَهُ (١)الزُّبَيْرُ بنُ العَوَّامِ(٢) بَعْدَهُ';
    const exact = 'الزُّبَيْرُ بنُ العَوَّامِ';
    const { start, end } = resolveSpan(body, { exact });
    expect(body.slice(start, end)).toBe(exact);
  });

  it('resolves a quote at the very start and end of the body', () => {
    const body = 'الزُّبَيْرُ بنُ العَوَّامِ بنِ خُوَيْلِدِ';
    expect(resolveSpan(body, { exact: body })).toEqual({ start: 0, end: body.length });
  });
});

describe('a page with an entry number, a siglum and a paragraph break', () => {
  const page = `٣ - ${NAME} * (ع)

ابْنِ قُصَيِّ بنِ كِلاَبِ بنِ مُرَّةَ بنِ كَعْبِ بنِ لُؤَيِّ بنِ غَالِبٍ.
`;

  it('resolves the name line with the entry number as prefix', () => {
    expect(renderSpan(page, { exact: NAME, prefix: '٣ - ' })).toBe(NAME);
  });

  it('resolves a span after the siglum across the paragraph break', () => {
    const exact = 'ابْنِ قُصَيِّ بنِ كِلاَبِ بنِ مُرَّةَ';
    expect(renderSpan(page, { exact, prefix: '* (ع) ' })).toBe(exact);
  });
});
