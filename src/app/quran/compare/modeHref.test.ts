import { describe, expect, it } from 'vitest';
import { modeHref } from './modeHref';

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
