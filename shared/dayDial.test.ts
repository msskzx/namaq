import { describe, expect, it } from 'vitest';
import { DAY_MINUTES, dialAngle, lineRows, moonOn, moonPath, onCircle } from './dayDial';

describe('the day dial', () => {
  it('puts noon on top, midnight at the bottom, and the morning on the left', () => {
    expect(dialAngle(12 * 60)).toBe(0);
    expect(dialAngle(0)).toBe(180);
    const [x] = onCircle(dialAngle(9 * 60), 100);
    expect(x).toBeLessThan(0);
  });
});

describe('the day line', () => {
  it('puts each time at its own minute when they are far apart', () => {
    const minutes = [300, 720, 1020];
    expect(lineRows(minutes, 480, 30)).toEqual(minutes.map(m => (m / DAY_MINUTES) * 480));
  });
  it('keeps close times apart and in order, never past the line', () => {
    const rows = lineRows([300, 720, 1380, 1395, 1430], 480, 30);
    for (let i = 1; i < rows.length; i++) expect(rows[i] - rows[i - 1]).toBeGreaterThanOrEqual(30);
    expect(rows[rows.length - 1]).toBeLessThanOrEqual(480);
  });
});

describe('the month moons', () => {
  it('grows from new to full in the middle of the month and wanes after', () => {
    expect(moonOn(1).lit).toBe(0);
    expect(moonOn(15).lit).toBeGreaterThan(0.99);
    expect(moonOn(8).waxing).toBe(true);
    expect(moonOn(22).waxing).toBe(false);
  });
  it('lights a growing crescent on the right and a waning one on the left', () => {
    expect(moonPath(4, 7)).toMatch(/^M0 -7 A7 7 0 0 1/);
    expect(moonPath(26, 7)).toMatch(/^M0 -7 A7 7 0 0 0/);
  });
});
