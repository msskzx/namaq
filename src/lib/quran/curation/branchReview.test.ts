import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextBranchVerdict, recordBranchReview } from './branchReview';

const FILE = 'shared/data/quran/branchVerdicts.json';
let root: string;
const onDisk = () => JSON.parse(readFileSync(join(root, FILE), 'utf8')).trees;

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'branch-review-'));
  mkdirSync(join(root, 'shared/data/quran'), { recursive: true });
  writeFileSync(join(root, FILE), '{\n "trees": {}\n}\n');
  vi.spyOn(process, 'cwd').mockReturnValue(root);
});
afterEach(() => vi.restoreAllMocks());

describe('branch review', () => {
  it('records keep, drop and discuss, and a second press of the same choice clears it', () => {
    recordBranchReview('cmp:a', 'drop', 'إن المتقين');
    expect(onDisk()['cmp:a']).toEqual({ keep: false, why: '(owner removed)', checked: true, text: 'إن المتقين' });
    recordBranchReview('cmp:a', 'keep');
    expect(onDisk()['cmp:a']).toEqual({ keep: true, why: '(owner kept)', checked: true, text: 'إن المتقين' });
    recordBranchReview('cmp:a', 'discuss');
    expect(onDisk()['cmp:a']).toMatchObject({ keep: true, ask: 'owner: discuss' });
    recordBranchReview('cmp:a', 'undo');
    expect(onDisk()).toEqual({});
  });

  it('keeps the file in the repo format', () => {
    recordBranchReview('cmp:b', 'drop');
    expect(readFileSync(join(root, FILE), 'utf8')).toBe('{\n "trees": {\n  "cmp:b": {\n   "keep": false,\n   "why": "(owner removed)",\n   "checked": true\n  }\n }\n}\n');
  });

  it('a question keeps the earlier keep or drop', () => {
    expect(nextBranchVerdict({ keep: false, why: '(owner removed)', checked: true }, 'discuss')).toMatchObject({ keep: false, ask: 'owner: discuss' });
  });
});
