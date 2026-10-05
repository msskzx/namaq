import { describe, expect, it } from 'vitest';
import { fixturesRoot } from './hadithView';
import { unitRows } from './unitRows';

describe('unitRows (the Jibril fixtures)', () => {
  const { units, links } = unitRows(fixturesRoot);

  it('has one row per unit, each carrying its whole view', () => {
    expect(units.map((u) => u.unit).sort()).toEqual([
      'bukhari-jibril',
      'fath-iman-50',
      'muslim-jibril',
    ]);
    const bukhari = units.find((u) => u.unit === 'bukhari-jibril')!;
    expect(bukhari).toMatchObject({ book: 'صحيح البخاري', type: 'hadith', work: 'test-bukhari' });
    expect(bukhari.view.reports[0].scenes[0].lines.length).toBeGreaterThan(10);
    expect(bukhari.view.id).toBe(bukhari.unit);
  });

  it('turns the commentary link and the same-event link into rows, each with its basis text', () => {
    const keys = links.map((l) => `${l.fromUnit}>${l.toUnit}:${l.kind}`).sort();
    expect(keys).toEqual([
      'bukhari-jibril>muslim-jibril:SAME_EVENT',
      'fath-iman-50>bukhari-jibril:EXPLAINS',
      'muslim-jibril>bukhari-jibril:SAME_EVENT',
    ]);
    expect(links.every((l) => l.basis.length > 0)).toBe(true);
  });

  it('serialises as JSON without loss, since the view column is JSONB', () => {
    for (const u of units) expect(JSON.parse(JSON.stringify(u.view))).toEqual(u.view);
  });
});
