import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextBranchVerdict, recordBranchReview } from './branchReview';

const FILE = 'shared/data/quran/branchVerdicts.json';
const TWINS = 'shared/data/quran/twinVerdicts.json';
let root: string;
const onDisk = () => JSON.parse(readFileSync(join(root, FILE), 'utf8')).trees;

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'branch-review-'));
  mkdirSync(join(root, 'shared/data/quran'), { recursive: true });
  writeFileSync(join(root, FILE), '{\n "trees": {}\n}\n');
  writeFileSync(join(root, TWINS), JSON.stringify({ twins: { 'cmp:twin': { pair: '2:8|3:114', keep: false, why: 'From compare', view: 'matrix' } } }));
  vi.spyOn(process, 'cwd').mockReturnValue(root);
});
afterEach(() => vi.restoreAllMocks());

describe('branch review', () => {
  it('records keep, drop and discuss, and a second press of the same choice clears it', () => {
    recordBranchReview('cmp:a', 'drop');
    expect(onDisk()['cmp:a']).toEqual({ keep: false, why: '(owner removed)', checked: true });
    recordBranchReview('cmp:a', 'keep');
    expect(onDisk()['cmp:a']).toEqual({ keep: true, why: '(owner kept)', checked: true });
    recordBranchReview('cmp:a', 'discuss');
    expect(onDisk()['cmp:a']).toMatchObject({ keep: true, ask: 'owner: discuss' });
    recordBranchReview('cmp:a', 'undo');
    expect(onDisk()).toEqual({});
  });

  it('keeps the file in the repo format', () => {
    recordBranchReview('cmp:b', 'drop');
    expect(readFileSync(join(root, FILE), 'utf8')).toBe('{\n "trees": {\n  "cmp:b": {\n   "keep": false,\n   "why": "(owner removed)",\n   "checked": true\n  }\n }\n}\n');
  });

  it('a twin is decided once, as its compare pair: the press joins the compare review log and the twin shows it at once', () => {
    vi.stubEnv('NODE_ENV', 'development');
    mkdirSync(join(root, 'src/app/quran/compare'), { recursive: true });
    mkdirSync(join(root, 'src/lib/quran/curation'), { recursive: true });
    writeFileSync(join(root, 'src/app/quran/compare/pairs.json'), JSON.stringify({ pairs: [{ a: '2:8', b: '3:114' }] }));
    writeFileSync(join(root, 'src/app/quran/compare/passagePairs.json'), JSON.stringify({ pairs: [] }));
    writeFileSync(join(root, 'src/lib/quran/curation/compareLinks.json'), JSON.stringify({ links: [] }));
    recordBranchReview('cmp:twin', 'keep');
    expect(onDisk()).toEqual({});
    expect(JSON.parse(readFileSync(join(root, '.review-log.jsonl'), 'utf8'))).toMatchObject({ page: '2/3', card: ['2:8|3:114'], action: 'keep' });
    expect(JSON.parse(readFileSync(join(root, TWINS), 'utf8')).twins['cmp:twin']).toMatchObject({ pair: '2:8|3:114', keep: true, checked: true, view: 'matrix' });
    vi.unstubAllEnvs();
  });

  it('a question keeps the earlier keep or drop', () => {
    expect(nextBranchVerdict({ keep: false, why: '(owner removed)', checked: true }, 'discuss')).toMatchObject({ keep: false, ask: 'owner: discuss' });
  });
});
