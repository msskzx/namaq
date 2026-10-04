import { readFileSync } from 'node:fs';
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

describe('the al-Zubayr page', () => {
  const page = readFileSync(
    'data/history/sources/siyar-alam-al-nubala-risalah/v4/41.md',
    'utf8',
  );

  it('resolves the name line with the entry number as prefix', () => {
    expect(renderSpan(page, { exact: NAME, prefix: '٣ - ' })).toBe(NAME);
  });

  it('resolves a span across the paragraph break after the siglum', () => {
    const exact = 'ابْنِ قُصَيِّ بنِ كِلاَبِ بنِ مُرَّةَ';
    expect(renderSpan(page, { exact, prefix: '* (ع) ' })).toBe(exact);
  });
});
