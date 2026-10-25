import { describe, expect, it } from 'vitest';
import { modeHref, pairHref, surahHref, tabHref, viewHref, withRange } from './modeHref';

describe('modeHref', () => {
  it('keeps the chosen surahs and drops the ayah ranges when switching to themes', () => {
    expect(modeHref('themes', { a: '55', af: '46', at: '61', b: '56' })).toBe('/quran/compare?mode=themes&a=55&b=56');
  });

  it('drops the mode when switching back to text', () => {
    expect(modeHref('text', { mode: 'themes', a: '16', b: '43' })).toBe('/quran/compare?a=16&b=43');
  });

  it('links to the bare page when no surah is chosen', () => {
    expect(modeHref('text', {})).toBe('/quran/compare');
  });

  it('keeps the juz or surah range', () => {
    expect(modeHref('themes', { a: '16', b: '43', juzFrom: '25', juzTo: '30' })).toBe('/quran/compare?mode=themes&a=16&b=43&juzFrom=25&juzTo=30');
    expect(modeHref('text', { by: 'surah', surahFrom: '90', surahTo: '114' })).toBe('/quran/compare?by=surah&surahFrom=90&surahTo=114');
  });
});

describe('viewHref', () => {
  it('keeps the surahs and ayah ranges and switches the ayah-by-ayah view on or off', () => {
    expect(viewHref(true, { a: '56', af: '70', at: '80', b: '69' })).toBe('/quran/compare?a=56&af=70&at=80&b=69&view=ayat');
    expect(viewHref(false, { a: '56', b: '69', view: 'ayat' })).toBe('/quran/compare?a=56&b=69');
    expect(viewHref(true, {})).toBe('/quran/compare?view=ayat');
  });
});

describe('tabHref and pairHref', () => {
  it('links each tab and keeps the range', () => {
    const query = { a: '56', b: '69', juzFrom: '27', juzTo: '29' };
    expect(tabHref('similar', query)).toBe('/quran/compare?a=56&b=69&juzFrom=27&juzTo=29');
    expect(tabHref('ayat', query)).toBe('/quran/compare?a=56&b=69&juzFrom=27&juzTo=29&view=ayat');
    expect(tabHref('themes', query)).toBe('/quran/compare?mode=themes&a=56&b=69&juzFrom=27&juzTo=29');
  });

  it('opens a new pair in the current tab, without the old ayah ranges', () => {
    expect(pairHref('ayat', 52, 56, { a: '1', af: '3', juzFrom: '27' })).toBe('/quran/compare?a=52&b=56&juzFrom=27&view=ayat');
  });
});

describe('surahHref and withRange', () => {
  it('carries the range to one surah and to a pair link', () => {
    expect(surahHref(74, { a: '1', by: 'surah', surahFrom: '70' })).toBe('/quran/compare?s=74&by=surah&surahFrom=70');
    expect(withRange('/quran/compare?a=1&b=2', { juzFrom: '30' })).toBe('/quran/compare?a=1&b=2&juzFrom=30');
    expect(withRange('/quran/compare?a=1&b=2', {})).toBe('/quran/compare?a=1&b=2');
  });
});
