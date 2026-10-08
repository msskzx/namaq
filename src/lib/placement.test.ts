import { describe, expect, it } from 'vitest';
import { formatInterval, placeUndated, placementSortYear, PlaceOrdering, PlaceSubject } from './placement';

describe('placeUndated', () => {
  it('places undated subjects in a chain between dated bounds', () => {
    const subjects: PlaceSubject[] = [
      { slug: 'A', hijriYear: 2 },
      { slug: 'U1', hijriYear: null },
      { slug: 'U2', hijriYear: null },
      { slug: 'B', hijriYear: 5 },
    ];
    const orderings: PlaceOrdering[] = [
      { earlier: 'A', later: 'U1' },
      { earlier: 'U1', later: 'U2' },
      { earlier: 'U2', later: 'B' },
    ];
    const result = placeUndated(subjects, orderings);
    expect(result.get('U1')).toEqual({ from: { slug: 'A', year: 2 }, to: { slug: 'B', year: 5 } });
    expect(result.get('U2')).toEqual({ from: { slug: 'A', year: 2 }, to: { slug: 'B', year: 5 } });
    expect(result.has('A')).toBe(false);
    expect(result.has('B')).toBe(false);
  });

  it('places undated subject with only an earlier dated bound', () => {
    const subjects: PlaceSubject[] = [
      { slug: 'A', hijriYear: 2 },
      { slug: 'U', hijriYear: null },
    ];
    const orderings: PlaceOrdering[] = [
      { earlier: 'A', later: 'U' },
    ];
    const result = placeUndated(subjects, orderings);
    expect(result.get('U')).toEqual({ from: { slug: 'A', year: 2 } });
  });

  it('places undated subject with only a later dated bound', () => {
    const subjects: PlaceSubject[] = [
      { slug: 'U', hijriYear: null },
      { slug: 'B', hijriYear: 5 },
    ];
    const orderings: PlaceOrdering[] = [
      { earlier: 'U', later: 'B' },
    ];
    const result = placeUndated(subjects, orderings);
    expect(result.get('U')).toEqual({ to: { slug: 'B', year: 5 } });
  });

  it('does not place undated subject with no ordering constraints', () => {
    const subjects: PlaceSubject[] = [
      { slug: 'U', hijriYear: null },
      { slug: 'A', hijriYear: 2 },
    ];
    const orderings: PlaceOrdering[] = [];
    const result = placeUndated(subjects, orderings);
    expect(result.has('U')).toBe(false);
  });

  it('marks undated subjects in a cycle as disputed', () => {
    const subjects: PlaceSubject[] = [
      { slug: 'U1', hijriYear: null },
      { slug: 'U2', hijriYear: null },
    ];
    const orderings: PlaceOrdering[] = [
      { earlier: 'U1', later: 'U2' },
      { earlier: 'U2', later: 'U1' },
    ];
    const result = placeUndated(subjects, orderings);
    expect(result.get('U1')).toEqual({ unplaced: 'disputed' });
    expect(result.get('U2')).toEqual({ unplaced: 'disputed' });
  });

  it('marks undated subject with contradictory bounds as having a contradiction', () => {
    const subjects: PlaceSubject[] = [
      { slug: 'A', hijriYear: 5 },
      { slug: 'U', hijriYear: null },
      { slug: 'B', hijriYear: 3 },
    ];
    const orderings: PlaceOrdering[] = [
      { earlier: 'A', later: 'U' },
      { earlier: 'U', later: 'B' },
    ];
    const result = placeUndated(subjects, orderings);
    expect(result.get('U')).toEqual({ unplaced: 'contradiction' });
  });

  it('places undated subject with same-year bounds', () => {
    const subjects: PlaceSubject[] = [
      { slug: 'A', hijriYear: 3 },
      { slug: 'U', hijriYear: null },
      { slug: 'B', hijriYear: 3 },
    ];
    const orderings: PlaceOrdering[] = [
      { earlier: 'A', later: 'U' },
      { earlier: 'U', later: 'B' },
    ];
    const result = placeUndated(subjects, orderings);
    expect(result.get('U')).toEqual({ from: { slug: 'A', year: 3 }, to: { slug: 'B', year: 3 } });
  });

  it('marks subject with yearDisputed as disputed even when dated', () => {
    const subjects: PlaceSubject[] = [
      { slug: 'A', hijriYear: 2 },
      { slug: 'U', hijriYear: 4, yearDisputed: true },
      { slug: 'B', hijriYear: 5 },
    ];
    const orderings: PlaceOrdering[] = [
      { earlier: 'A', later: 'U' },
      { earlier: 'U', later: 'B' },
    ];
    const result = placeUndated(subjects, orderings);
    expect(result.get('U')).toEqual({ unplaced: 'disputed' });
  });

  it('does not use a dated subject with yearDisputed as a bound', () => {
    const subjects: PlaceSubject[] = [
      { slug: 'A', hijriYear: 2, yearDisputed: true },
      { slug: 'U', hijriYear: null },
      { slug: 'B', hijriYear: 5 },
    ];
    const orderings: PlaceOrdering[] = [
      { earlier: 'A', later: 'U' },
      { earlier: 'U', later: 'B' },
    ];
    const result = placeUndated(subjects, orderings);
    expect(result.get('U')).toEqual({ to: { slug: 'B', year: 5 } });
  });

  it('places undated subject across hijra boundary', () => {
    const subjects: PlaceSubject[] = [
      { slug: 'A', hijriYear: -1 },
      { slug: 'U', hijriYear: null },
      { slug: 'B', hijriYear: 2 },
    ];
    const orderings: PlaceOrdering[] = [
      { earlier: 'A', later: 'U' },
      { earlier: 'U', later: 'B' },
    ];
    const result = placeUndated(subjects, orderings);
    expect(result.get('U')).toEqual({ from: { slug: 'A', year: -1 }, to: { slug: 'B', year: 2 } });
  });

  it('uses the nearest dated bound when multiple are available', () => {
    const subjects: PlaceSubject[] = [
      { slug: 'A', hijriYear: 1 },
      { slug: 'X', hijriYear: 4 },
      { slug: 'U', hijriYear: null },
      { slug: 'Y', hijriYear: 6 },
      { slug: 'Z', hijriYear: 9 },
    ];
    const orderings: PlaceOrdering[] = [
      { earlier: 'A', later: 'U' },
      { earlier: 'X', later: 'U' },
      { earlier: 'U', later: 'Y' },
      { earlier: 'U', later: 'Z' },
    ];
    const result = placeUndated(subjects, orderings);
    expect(result.get('U')).toEqual({ from: { slug: 'X', year: 4 }, to: { slug: 'Y', year: 6 } });
  });

  it('uses smaller slug to break ties on year when selecting nearest bound', () => {
    const subjects: PlaceSubject[] = [
      { slug: 'A', hijriYear: 5 },
      { slug: 'B', hijriYear: 5 },
      { slug: 'U', hijriYear: null },
    ];
    const orderings: PlaceOrdering[] = [
      { earlier: 'A', later: 'U' },
      { earlier: 'B', later: 'U' },
    ];
    const result = placeUndated(subjects, orderings);
    expect(result.get('U')).toEqual({ from: { slug: 'A', year: 5 } });
  });

  it('does not place a dated subject even when it appears in orderings', () => {
    const subjects: PlaceSubject[] = [
      { slug: 'A', hijriYear: 2 },
      { slug: 'B', hijriYear: 5 },
    ];
    const orderings: PlaceOrdering[] = [
      { earlier: 'A', later: 'B' },
    ];
    const result = placeUndated(subjects, orderings);
    expect(result.has('A')).toBe(false);
    expect(result.has('B')).toBe(false);
  });
});

describe('placementSortYear', () => {
  it('returns 2.25 for a placement with from year 2', () => {
    expect(placementSortYear({ from: { slug: 'A', year: 2 } })).toBe(2.25);
  });

  it('returns 4.75 for a placement with to year 5', () => {
    expect(placementSortYear({ to: { slug: 'B', year: 5 } })).toBe(4.75);
  });

  it('returns -0.75 for a placement with from year -1', () => {
    expect(placementSortYear({ from: { slug: 'A', year: -1 } })).toBe(-0.75);
  });

  it('uses from year when both bounds are present', () => {
    expect(placementSortYear({ from: { slug: 'A', year: 2 }, to: { slug: 'B', year: 5 } })).toBe(2.25);
  });

  it('returns null for disputed placement', () => {
    expect(placementSortYear({ unplaced: 'disputed' })).toBe(null);
  });

  it('returns null for contradiction placement', () => {
    expect(placementSortYear({ unplaced: 'contradiction' })).toBe(null);
  });

  it('returns null for undefined placement', () => {
    expect(placementSortYear(undefined)).toBe(null);
  });
});

describe('formatInterval', () => {
  it('formats interval with both bounds in English', () => {
    expect(formatInterval({ from: { slug: 'A', year: -1 }, to: { slug: 'B', year: 2 } }, 'en')).toBe('Between 1 BH and 2 AH');
  });

  it('formats interval with both bounds in Arabic', () => {
    expect(formatInterval({ from: { slug: 'A', year: -1 }, to: { slug: 'B', year: 2 } }, 'ar')).toBe('بين 1 ق.هـ و2 هـ');
  });

  it('formats interval with only from bound in English', () => {
    expect(formatInterval({ from: { slug: 'A', year: 2 } }, 'en')).toBe('After 2 AH');
  });

  it('formats interval with only from bound in Arabic', () => {
    expect(formatInterval({ from: { slug: 'A', year: 2 } }, 'ar')).toBe('بعد 2 هـ');
  });

  it('formats interval with only to bound in English', () => {
    expect(formatInterval({ to: { slug: 'B', year: 5 } }, 'en')).toBe('Before 5 AH');
  });

  it('formats interval with only to bound in Arabic', () => {
    expect(formatInterval({ to: { slug: 'B', year: 5 } }, 'ar')).toBe('قبل 5 هـ');
  });

  it('returns null for disputed placement', () => {
    expect(formatInterval({ unplaced: 'disputed' }, 'en')).toBe(null);
  });

  it('returns null for contradiction placement', () => {
    expect(formatInterval({ unplaced: 'contradiction' }, 'ar')).toBe(null);
  });
});
