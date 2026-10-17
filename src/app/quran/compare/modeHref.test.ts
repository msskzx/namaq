import { describe, expect, it } from 'vitest';
import { modeHref, viewHref } from './modeHref';

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
});

describe('viewHref', () => {
  it('keeps the surahs and ayah ranges and switches the ayah-by-ayah view on or off', () => {
    expect(viewHref(true, { a: '56', af: '70', at: '80', b: '69' })).toBe('/quran/compare?a=56&af=70&at=80&b=69&view=ayat');
    expect(viewHref(false, { a: '56', b: '69', view: 'ayat' })).toBe('/quran/compare?a=56&b=69');
  });
});
