import { describe, expect, it } from 'vitest';
import { buildUsage, oldSlug, parseUsedLine, usedLine } from './usage';

// see R0045
const slugs = ['R0005-checks', 'R0008-split', 'R0027-context', 'R0031-a-card', 'R0032-branch', 'R0036-video', 'R0037-one-rule', 'R0045-a-scaled'];
const used = (line: string) => parseUsedLine(line, slugs);

describe('parseUsedLine with R ids', () => {
  it('counts every R id on the line, full or bare, and other projects named with theirs', () => {
    expect(used('R0008, R0027-context').used).toEqual(['namaq/R0008-split', 'namaq/R0027-context']);
    expect(used('R0031 (new record R0045 written here). ADR 0037, #737').used).toEqual(['namaq/R0031-a-card', 'namaq/R0045-a-scaled']);
    expect(used('R0008, distillate/R0005-a-mock-router')).toEqual({ used: ['distillate/R0005-a-mock-router', 'namaq/R0008-split'], unresolved: [] });
    expect(used('R0008; see docs/records/R0027-context.md').used).toEqual(['namaq/R0008-split']);
    expect(used('namaq/R0027-context').used).toEqual(['namaq/R0027-context']);
  });

  it('reports an R id that names no record', () => {
    expect(used('R0099, R0008-wrong').unresolved).toEqual([
      { text: 'R0099', reason: 'no such record' },
      { text: 'R0008-wrong', reason: 'no such record' },
    ]);
  });
});

describe('parseUsedLine for lines written before R ids', () => {
  it('reads old numbers and old slugs as the records that now hold them', () => {
    expect(oldSlug('R0045-a-scaled')).toBe('0031-a-scaled');
    expect(oldSlug('R0008-split')).toBe('0008-split');
    expect(used('0008, 0027').used).toEqual(['namaq/R0008-split', 'namaq/R0027-context']);
    expect(used('0031-a-scaled, namaq/0005-checks').used).toEqual(['namaq/R0045-a-scaled', 'namaq/R0005-checks']);
    expect(used('distillate/0005-a-mock-router').used).toEqual(['distillate/R0005-a-mock-router']);
  });

  it('reads nothing after none, in parentheses, after the first sentence or in an ADR item', () => {
    expect(used('none (checked docs/records; 0026 informed it)')).toEqual({ used: [], unresolved: [] });
    expect(used('none matched.').used).toEqual([]);
    expect(used('0005 (new record 0032)').used).toEqual(['namaq/R0005-checks']);
    expect(used('0032 (a hidden box). New record 0036: a video.').used).toEqual(['namaq/R0032-branch']);
    expect(used('0008, ADR 0035 and 0036 (tree node words).').used).toEqual(['namaq/R0008-split']);
  });

  it('reports a number two records shared, a number after an ADR item or a missing slug', () => {
    expect(used('0031, 0008')).toEqual({ used: ['namaq/R0008-split'], unresolved: [{ text: '0031', reason: '2 records share the number 0031' }] });
    expect(used('ADR 0035 and 0036 (tree node words), 0037 (one word rule), 0008-split')).toEqual({
      used: ['namaq/R0008-split'],
      unresolved: [{ text: '0037', reason: 'a bare number after an ADR may name an ADR' }],
    });
    expect(used('namaq/0030-gone').unresolved).toEqual([{ text: 'namaq/0030-gone', reason: 'no such record' }]);
  });
});

describe('buildUsage', () => {
  it('keeps merged PRs that have the line, by number, with the PR that added each record', () => {
    const usage = buildUsage(
      [
        { number: 9, title: 'B', body: 'x\n\nRecords used: R0008\n', mergedAt: '2026-11-14T10:00:00Z' },
        { number: 3, title: 'A', body: 'Records used: none', mergedAt: '2026-11-13T10:00:00Z' },
        { number: 5, title: 'C', body: null, mergedAt: '2026-11-13T11:00:00Z' },
      ],
      ['R0008-split'],
      () => 2,
    );
    expect(usedLine('a\nRecords used: R0001, R0002\n')).toBe('R0001, R0002');
    expect(usage.records).toEqual({ 'namaq/R0008-split': { file: 'docs/records/R0008-split.md', createdIn: 2 } });
    expect(usage.prs.map((p) => [p.number, p.mergedAt, p.used])).toEqual([
      [3, '2026-11-13', []],
      [9, '2026-11-14', ['namaq/R0008-split']],
    ]);
  });
});
