import { appendFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { appendReview, applyReviewLog, withUnappliedReviews, type ReviewPress } from './reviewLog';

const VERDICTS = 'src/lib/quran/curation/comparePairs.json';
const drafted = { '2:1|3:1': { keep: true, why: 'Same.' }, '2:2|3:2': { keep: false, why: 'Formula.' }, '4:1|5:1': { keep: true, why: 'Other page.' } };

let root: string;
const put = (path: string, value: unknown) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), `${JSON.stringify(value, null, 1)}\n`);
};
const onDisk = () => JSON.parse(readFileSync(join(root, VERDICTS), 'utf8')).pairs;
const press = (page: string, action: ReviewPress['action']) => appendReview({ t: 1, page, action });
const apply = (rebuild = vi.fn()) => applyReviewLog(rebuild);

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'review-log-'));
  vi.spyOn(process, 'cwd').mockReturnValue(root);
  vi.stubEnv('NODE_ENV', 'development');
  put(VERDICTS, { pairs: drafted });
  put('src/app/quran/compare/pairs.json', { pairs: [{ a: '2:1', b: '3:1' }, { a: '2:2', b: '3:2' }, { a: '4:1', b: '5:1' }] });
  put('src/app/quran/compare/passagePairs.json', { pairs: [] });
  put('src/lib/quran/curation/compareLinks.json', { links: [] });
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  rmSync(root, { recursive: true });
});

describe('the review log', () => {
  it('shows unapplied presses over the verdicts without writing them', () => {
    press('2/3', 'drop');
    expect(withUnappliedReviews(drafted)['2:1|3:1']).toEqual({ keep: false, why: 'Same. (owner removed)', checked: true, draft: { keep: true, why: 'Same.' } });
    expect(onDisk()).toEqual(drafted);
  });

  it('leaves the verdicts alone outside development', () => {
    press('2/3', 'drop');
    vi.stubEnv('NODE_ENV', 'production');
    expect(withUnappliedReviews(drafted)).toBe(drafted);
  });

  it('applies presses in order to that page only, and rebuilds the cards once', () => {
    press('2/3', 'drop');
    press('2/3', 'agree');
    const rebuild = vi.fn();
    expect(apply(rebuild).map(item => item.action)).toEqual(['drop', 'agree']);
    expect(rebuild).toHaveBeenCalledTimes(1);
    expect(onDisk()['2:1|3:1']).toEqual({ keep: true, why: 'Same.', checked: true, draft: { keep: true, why: 'Same.' } });
    expect(onDisk()['4:1|5:1']).toEqual(drafted['4:1|5:1']);
  });

  it('restores the draft on undo, removing a verdict that did not exist', () => {
    put('src/app/quran/compare/pairs.json', { pairs: [{ a: '2:1', b: '3:1' }, { a: '2:9', b: '3:9' }] });
    press('2/3', 'agree');
    press('2/3', 'undo');
    apply();
    expect(onDisk()['2:1|3:1']).toEqual(drafted['2:1|3:1']);
    expect(onDisk()['2:9|3:9']).toBeUndefined();
  });

  it('applies a press only once, and picks up the ones after it', () => {
    press('2/3', 'drop');
    apply();
    const rebuild = vi.fn();
    expect(apply(rebuild)).toEqual([]);
    expect(rebuild).not.toHaveBeenCalled();
    expect(withUnappliedReviews(onDisk())).toEqual(onDisk());
    press('4/5', 'agree');
    expect(apply().map(item => item.page)).toEqual(['4/5']);
    expect(onDisk()['2:1|3:1'].keep).toBe(false);
  });

  it('keeps the presses when the rebuild crashes, and the retry gives the same verdicts', () => {
    press('2/3', 'drop');
    press('4/5', 'undo');
    expect(() => apply(vi.fn(() => { throw new Error('crash'); }))).toThrow('crash');
    const once = onDisk();
    expect(apply()).toHaveLength(2);
    expect(onDisk()).toEqual(once);
  });

  it('waits for the end of a half-written line', () => {
    press('2/3', 'drop');
    appendFileSync(join(root, '.review-log.jsonl'), '{"t":2,"page":"4/');
    expect(apply().map(item => item.page)).toEqual(['2/3']);
  });
});
