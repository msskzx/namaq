import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { appendStoryReview, applyStoryReviewLog, withUnappliedStoryReviews, type StoryPress } from './storyReviewLog';

const VERDICTS = 'shared/quran/prophets/verdicts.json';
const drafted = { 'musa/7:103': { keep: true, why: 'Sent with signs.' }, 'musa/34:20': { keep: false, why: 'Not his story.' } };

let root: string;
const onDisk = () => JSON.parse(readFileSync(join(root, VERDICTS), 'utf8')).places;
const press = (key: string, action: StoryPress['action']) => appendStoryReview({ t: 1, key, action });

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'story-review-'));
  vi.spyOn(process, 'cwd').mockReturnValue(root);
  vi.stubEnv('NODE_ENV', 'development');
  mkdirSync(dirname(join(root, VERDICTS)), { recursive: true });
  writeFileSync(join(root, VERDICTS), JSON.stringify({ places: drafted }));
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  rmSync(root, { recursive: true, force: true });
});

describe('story review log', () => {
  it('shows presses on the owner machine before they are applied', () => {
    press('musa/7:103', 'drop');
    const seen = withUnappliedStoryReviews(drafted);
    expect(seen['musa/7:103']).toMatchObject({ keep: false, checked: true });
    expect(onDisk()).toEqual(drafted);
  });

  it('ignores the log outside development', () => {
    press('musa/7:103', 'drop');
    vi.stubEnv('NODE_ENV', 'production');
    expect(withUnappliedStoryReviews(drafted)).toBe(drafted);
  });

  it('folds keep, discuss and undo into the file once, and an undo brings the draft back', () => {
    press('musa/34:20', 'keep');
    press('musa/7:103', 'discuss');
    press('musa/7:103', 'undo');
    expect(applyStoryReviewLog()).toHaveLength(3);
    expect(onDisk()['musa/34:20']).toMatchObject({ keep: true, checked: true });
    expect(onDisk()['musa/7:103']).toEqual(drafted['musa/7:103']);
    expect(applyStoryReviewLog()).toEqual([]);
  });
});
