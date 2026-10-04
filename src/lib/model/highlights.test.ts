import { describe, expect, it } from 'vitest';
import { highlightsOnPage } from './highlights';
import { loadModel } from './load';

const WITNESS = 'siyar-alam-al-nubala-risalah';
const page41 = () => highlightsOnPage(loadModel('.'), '.', WITNESS, 4, '41');

describe('highlightsOnPage (al-Zubayr, page 41)', () => {
  const { body, marks } = page41();
  const text = (mark: { start: number; end: number }) => body.slice(mark.start, mark.end);

  it('returns the page body and marks in order that never overlap', () => {
    expect(marks.length).toBeGreaterThan(0);
    marks.forEach((m, i) => {
      expect(m.start).toBeLessThan(m.end);
      if (i > 0) expect(m.start).toBeGreaterThanOrEqual(marks[i - 1].end);
    });
  });

  it('marks the kunya and says which assertion rests on it', () => {
    const kunya = marks.find((m) => m.spans.some((s) => s.id === 'sp_kunya'))!;
    expect(text(kunya)).toContain('أَبُو عَبْدِ اللهِ');
    expect(kunya.assertions.map((a) => a.id)).toContain('a_kunya');
  });

  it('lets a stretch covered by two spans carry both', () => {
    const both = marks.find(
      (m) => m.spans.some((s) => s.id === 'sp_zb1') && m.spans.some((s) => s.id === 'sp_sex'),
    )!;
    expect(both.assertions.map((a) => a.id)).toEqual(expect.arrayContaining(['a_name', 'a_sex']));
  });

  it('marks nothing on a page no span reaches, and fails on a page with no text', () => {
    expect(highlightsOnPage(loadModel('.'), '.', WITNESS, 4, '43').marks).toEqual([]);
    expect(() => highlightsOnPage(loadModel('.'), '.', WITNESS, 4, '9999')).toThrow(/no text/);
  });
});
