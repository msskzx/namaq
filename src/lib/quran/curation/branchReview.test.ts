import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { twinVerdicts } from '@shared/quran/branchVerdicts';
import { applyBranchReviewLog, nextBranchVerdict, recordBranchReview } from './branchReview';

const FILE = 'shared/data/quran/branchVerdicts.json';
let root: string;
const onDisk = () => JSON.parse(readFileSync(join(root, FILE), 'utf8')).trees;
const log = (name: string) => readFileSync(join(root, name), 'utf8').trim().split('\n').map(line => JSON.parse(line));

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'branch-review-'));
  mkdirSync(join(root, 'shared/data/quran'), { recursive: true });
  writeFileSync(join(root, FILE), '{\n "trees": {}\n}\n');
  vi.spyOn(process, 'cwd').mockReturnValue(root);
});
afterEach(() => vi.restoreAllMocks());

describe('branch review', () => {
  it('appends each press to a log no page imports, and applying it gives the verdicts; a second press of the same choice clears it', () => {
    recordBranchReview('cmp:a', 'drop');
    recordBranchReview('cmp:a', 'keep');
    expect(onDisk()).toEqual({});
    expect(log('.branch-review-log.jsonl').map(press => press.action)).toEqual(['drop', 'keep']);
    applyBranchReviewLog();
    expect(onDisk()['cmp:a']).toEqual({ keep: true, why: '(owner kept)', checked: true });
    recordBranchReview('cmp:a', 'discuss');
    applyBranchReviewLog();
    expect(onDisk()['cmp:a']).toMatchObject({ keep: true, ask: 'owner: discuss' });
    recordBranchReview('cmp:a', 'undo');
    applyBranchReviewLog();
    expect(onDisk()).toEqual({});
    expect(applyBranchReviewLog()).toEqual([]);
  });

  it('keeps the file in the repo format', () => {
    recordBranchReview('cmp:b', 'drop');
    applyBranchReviewLog();
    expect(readFileSync(join(root, FILE), 'utf8')).toBe('{\n "trees": {\n  "cmp:b": {\n   "keep": false,\n   "why": "(owner removed)",\n   "checked": true\n  }\n }\n}\n');
  });

  it('a twin is decided once, as its compare pair: the press joins the compare review log', () => {
    const [id, twin] = Object.entries(twinVerdicts)[0];
    recordBranchReview(id, 'keep');
    expect(log('.review-log.jsonl')[0]).toMatchObject({ page: twin.pair.split('|').map(key => key.split(':')[0]).join('/'), card: [twin.pair], action: 'keep' });
    expect(onDisk()).toEqual({});
  });

  it('a question keeps the earlier keep or drop', () => {
    expect(nextBranchVerdict({ keep: false, why: '(owner removed)', checked: true }, 'discuss')).toMatchObject({ keep: false, ask: 'owner: discuss' });
  });
});
