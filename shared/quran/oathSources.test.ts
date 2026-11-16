import { describe, expect, it } from 'vitest';
import { KIND_QUOTES, OATH_QUOTES } from './oathSources';
import { ALLAH_OATHS, OTHER_OATHS } from './oaths';

const id = (o: { surah: number; range: [number, number] }) => `${o.surah}:${o.range[0]}`;

describe('oath sources', () => {
  it('quotes a scholar for every oath of Allah and for nothing else', () => {
    expect(Object.keys(OATH_QUOTES).sort()).toEqual(ALLAH_OATHS.map(id).sort());
    for (const o of OTHER_OATHS) expect(OATH_QUOTES[id(o)]).toBeUndefined();
  });

  it('gives each quote its book, page and a link to that page', () => {
    for (const q of [...Object.values(KIND_QUOTES), ...Object.values(OATH_QUOTES).flat()]) {
      expect(q.text.length).toBeGreaterThan(20);
      expect(q.text).not.toMatch(/[ً-ْ]|\(\^\d+\)|\[[^\]]*: \d/);
      expect(q.cite).toMatch(/^(ابن القيم، التبيان ص|ابن كثير، التفسير|السعدي، التفسير ص|النحاس، إعراب القرآن) [٠-٩/]+$/);
      expect(q.url).toMatch(/^https:\/\/(quranpedia\.app\/books\/b18337\/s\d+\.html#p\d+|shamela\.ws\/book\/8473\/\d+|quranpedia\.net\/book\/(3\/1|318\/2)\/\d+)$/);
    }
  });

  it('heads each list with Ibn al-Qayyim', () => {
    expect(KIND_QUOTES.allah.cite).toBe('ابن القيم، التبيان ص ٥');
    expect(KIND_QUOTES.others.text).toContain('﴿وتالله لأكيدن أصنامكم﴾');
  });
});
