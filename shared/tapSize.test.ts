import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { MIN_TAP, slopFor, touchOf } from '../mobile/src/ui/tapSize';

const ROOT = join(__dirname, '..');
const read = (path: string) => readFileSync(join(ROOT, path), 'utf8');

describe('tap floor', () => {
  it('widens a small press to the floor and leaves a big one as it is', () => {
    for (const size of [{ width: 18, height: 18 }, { width: 28, height: 28 }, { width: 120, height: 20 }, { width: 30, height: 60 }]) {
      const touch = touchOf(size, slopFor(size));
      expect(touch.width).toBeGreaterThanOrEqual(MIN_TAP);
      expect(touch.height).toBeGreaterThanOrEqual(MIN_TAP);
    }
    expect(slopFor({ width: 60, height: 50 })).toEqual({ top: 0, bottom: 0, left: 0, right: 0 });
  });

  it('keeps a bigger slop a press asks for', () => {
    expect(slopFor({ width: 40, height: 40 }, 10)).toEqual({ top: 10, bottom: 10, left: 10, right: 10 });
    expect(slopFor({ width: 20, height: 40 }, { top: 6 })).toEqual({ top: 6, bottom: 2, left: 12, right: 12 });
  });

  it('is applied by Tap, the one press every app button goes through', () => {
    const tap = read('mobile/src/ui/Tap.tsx');
    expect(tap).toMatch(/hitSlop=\{slopFor\(size,/);
    expect(tap).toMatch(/onLayout=/);
    expect(tap.match(/hitSlop=/g)).toHaveLength(1);
    expect(tap.indexOf('{...rest}')).toBeLessThan(tap.indexOf('hitSlop={slopFor('));
  });

  it('is applied to every website Button and to the chip\'s clear button', () => {
    expect(read('src/components/common/Chip.tsx')).toMatch(/const x = `\$\{TAP_FLOOR\} relative /);
    const button = read('src/components/common/Button.tsx');
    expect(button).toContain(`(100%_-_${MIN_TAP}px)/2`);
    expect(button).toMatch(/export const TAP_FLOOR = "after:absolute after:content-\[''\] after:inset-\[min\(0px,calc\(\(100%_-_\d+px\)\/2\)\)\]";/);
    expect(button).toMatch(/'inline-flex items-center justify-center gap-2 transition', TAP_FLOOR,/);
  });
});
