import { describe, expect, it } from 'vitest';
import { BY_QUOTES, KIND_QUOTES, OATH_BY, OATH_QUOTES, OATH_SECTIONS, ON_QUOTES, oathSections } from './oathSources';
import { ALLAH_OATHS, OTHER_OATHS } from './oaths';

const id = (o: { surah: number; range: [number, number] }) => `${o.surah}:${o.range[0]}`;

describe('oath sources', () => {
  it('quotes a scholar for every oath of Allah and for nothing else', () => {
    expect(Object.keys(OATH_QUOTES).sort()).toEqual(ALLAH_OATHS.map(id).sort());
    for (const o of OTHER_OATHS) expect(OATH_QUOTES[id(o)]).toBeUndefined();
  });

  it('gives each quote its book, page and a link to that page', () => {
    for (const q of [...Object.values(KIND_QUOTES), ...Object.values(OATH_QUOTES).flat(), ...ON_QUOTES, ...BY_QUOTES]) {
      expect(q.text.length).toBeGreaterThan(20);
      expect(q.text).not.toMatch(/[ً-ْ]|\(\^\d+\)|\[[^\]]*: \d/);
      expect(q.cite).toMatch(/^(ابن القيم، التبيان ص|ابن كثير، التفسير|السعدي، التفسير ص|النحاس، إعراب القرآن|السيوطي، الإتقان) [٠-٩/]+$/);
      expect(q.url).toMatch(/^https:\/\/(quranpedia\.app\/books\/b18337\/s\d+\.html#p\d+|shamela\.ws\/book\/(8473|11728)\/\d+|quranpedia\.net\/book\/(3\/1|318\/2)\/\d+)$/);
    }
  });

  it('heads each list with Ibn al-Qayyim', () => {
    expect(KIND_QUOTES.allah.cite).toBe('ابن القيم، التبيان ص ٥');
    expect(KIND_QUOTES.others.text).toContain('﴿وتالله لأكيدن أصنامكم﴾');
  });

  it('puts every oath of Allah in exactly one section, in mushaf order', () => {
    const placed = OATH_SECTIONS.flatMap(s => s.oaths);
    expect([...placed].sort()).toEqual(ALLAH_OATHS.map(id).sort());
    const order = ALLAH_OATHS.map(id);
    for (const s of OATH_SECTIONS) expect(s.oaths).toEqual([...s.oaths].sort((a, b) => order.indexOf(a) - order.indexOf(b)));
    expect(OATH_SECTIONS.filter(s => s.ours).map(s => s.on)).toEqual(['unnamed']);
  });

  it('places each oath in a named section only where Ibn al-Qayyim says so, his words first', () => {
    for (const s of OATH_SECTIONS.filter(s => !s.ours)) for (const o of s.oaths) expect(OATH_QUOTES[o][0].cite).toMatch(/^ابن القيم/);
  });

  it('says what every oath of Allah swears by', () => {
    const named = new Set(OATH_BY.flatMap(b => b.oaths));
    expect([...named].sort()).toEqual(ALLAH_OATHS.map(id).sort());
  });

  it('keeps a chip’s oaths within their sections and drops the sections left empty', () => {
    expect(oathSections(null)).toHaveLength(OATH_SECTIONS.length);
    expect(oathSections('prophet').map(s => [s.on, s.oaths])).toEqual([['unnamed', ['15:72']]]);
  });
});
