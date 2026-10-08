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

describe('unitRows links with the same key', () => {
  it('has no duplicate (from, to, kind) key, which the primary key would reject', () => {
    const { links } = unitRows(fixturesRoot);
    const keys = links.map((l) => `${l.fromUnit}>${l.toUnit}:${l.kind}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe('unitRows people rows (the Jibril fixtures)', () => {
  const { people } = unitRows(fixturesRoot);

  it('returns one row per (unit, person, role) combination', () => {
    const keys = people.map((p) => `${p.unit}|${p.person}|${p.role}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('includes identified narrators from the isnad chain', () => {
    expect(people).toContainEqual({ unit: 'bukhari-jibril', person: 'abu-hurayrah', role: 'isnad' });
    expect(people).toContainEqual({
      unit: 'bukhari-jibril',
      person: 'ismail-ibn-ibrahim-ibn-ulayyah',
      role: 'isnad',
    });
  });

  it('includes identified speakers from the scenes', () => {
    expect(people).toContainEqual({
      unit: 'bukhari-jibril',
      person: 'prophet-muhammad',
      role: 'speaks',
    });
    expect(people).toContainEqual({ unit: 'muslim-jibril', person: 'umar-ibn-al-khattab', role: 'speaks' });
  });

  it('includes identified proposed speakers', () => {
    expect(people).toContainEqual({ unit: 'bukhari-jibril', person: 'jibril', role: 'speaks' });
    expect(people).toContainEqual({ unit: 'muslim-jibril', person: 'jibril', role: 'speaks' });
  });

  it('gives no row for unidentified narrators', () => {
    expect(people.every((p) => p.person !== 'musaddad')).toBe(true);
    expect(people.every((p) => p.person !== 'abu-hayyan')).toBe(true);
  });

  it('gives no row for unidentified mentions without a standing agent', () => {
    expect(people.every((p) => p.person !== 'ibn-umar')).toBe(true);
    expect(people.every((p) => p.person !== 'ragul')).toBe(true);
  });

  it('gives no row for a (unit, person, role) combination that would be duplicated', () => {
    const counts = people.reduce(
      (acc, p) => {
        const key = `${p.unit}|${p.person}|${p.role}`;
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    expect(Object.values(counts).every((c) => c === 1)).toBe(true);
  });

  it('includes isnad and speaks roles', () => {
    const roles = new Set(people.map((p) => p.role));
    expect(Array.from(roles)).toContain('isnad');
    expect(Array.from(roles)).toContain('speaks');
  });
});
