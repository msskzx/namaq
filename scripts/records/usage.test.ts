import { describe, expect, it } from 'vitest';
import { buildUsage, parseUsedLine, usedLine } from './usage';

const slugs = ['0005-checks', '0008-split', '0027-context', '0031-a-card', '0031-a-scaled', '0032-hidden', '0036-video', '0037-one-rule'];
const used = (line: string) => parseUsedLine(line, slugs);

describe('parseUsedLine', () => {
  it('reads ids, full slugs and other projects', () => {
    expect(used('0008, 0027').used).toEqual(['namaq/0008-split', 'namaq/0027-context']);
    expect(used('0031-a-card, namaq/0005-checks').used).toEqual(['namaq/0031-a-card', 'namaq/0005-checks']);
    expect(used('distillate/0005-a-mock-router').used).toEqual(['distillate/0005-a-mock-router']);
  });

  it('reads nothing after none, in parentheses, after the first sentence or in an ADR item', () => {
    expect(used('none (checked docs/records; 0026 informed it)')).toEqual({ used: [], unresolved: [] });
    expect(used('none matched.').used).toEqual([]);
    expect(used('0005 (new record 0032)').used).toEqual(['namaq/0005-checks']);
    expect(used('0032 (a hidden box). New record 0036: a video.').used).toEqual(['namaq/0032-hidden']);
    expect(used('0008, ADR 0035 and 0036 (tree node words).').used).toEqual(['namaq/0008-split']);
  });

  it('reports a shared number or a missing slug instead of guessing', () => {
    expect(used('0031, 0008')).toEqual({ used: ['namaq/0008-split'], unresolved: [{ text: '0031', reason: '2 records share the number 0031' }] });
    expect(used('ADR 0035 and 0036 (tree node words), 0037 (one word rule), 0008-split')).toEqual({
      used: ['namaq/0008-split'],
      unresolved: [{ text: '0037', reason: 'a bare number after an ADR may name an ADR' }],
    });
    expect(used('namaq/0030-gone').unresolved).toEqual([{ text: 'namaq/0030-gone', reason: 'no such record' }]);
  });
});

describe('buildUsage', () => {
  it('keeps merged PRs that have the line, by number, with the PR that added each record', () => {
    const usage = buildUsage(
      [
        { number: 9, title: 'B', body: 'x\n\nRecords used: 0008\n', mergedAt: '2026-11-14T10:00:00Z' },
        { number: 3, title: 'A', body: 'Records used: none', mergedAt: '2026-11-13T10:00:00Z' },
        { number: 5, title: 'C', body: null, mergedAt: '2026-11-13T11:00:00Z' },
      ],
      ['0008-split'],
      () => 2,
    );
    expect(usedLine('a\nRecords used: 0001, 0002\n')).toBe('0001, 0002');
    expect(usage.records).toEqual({ 'namaq/0008-split': { file: 'docs/records/0008-split.md', createdIn: 2 } });
    expect(usage.prs.map((p) => [p.number, p.mergedAt, p.used])).toEqual([
      [3, '2026-11-13', []],
      [9, '2026-11-14', ['namaq/0008-split']],
    ]);
  });
});
