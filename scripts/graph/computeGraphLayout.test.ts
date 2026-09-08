import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getDriver, run, executeWrite, close } = vi.hoisted(() => {
  const run = vi.fn();
  const executeWrite = vi.fn((work: (tx: { run: typeof run }) => unknown) => work({ run }));
  const close = vi.fn();
  return {
    getDriver: vi.fn(() => ({ session: () => ({ executeWrite, close }) })),
    run,
    executeWrite,
    close,
  };
});
vi.mock('../../src/lib/neo4j', () => ({ getDriver }));

import { estimateLabelRadius, writeSubjectPropertiesToNeo4j, type SubjectPropertyRow } from './computeGraphLayout';

describe('estimateLabelRadius', () => {
  it('grows with label length', () => {
    expect(estimateLabelRadius('Ali')).toBeLessThan(estimateLabelRadius('Muhammad ibn Abdullah'));
  });

  it('never shrinks below the minimum circle for a very short label', () => {
    // Math.max(estimatedTextWidth + fontSize, fontSize*2) / 2, fontSize=12
    // -- floor is fontSize*2/2 = 12.
    expect(estimateLabelRadius('')).toBe(12);
  });
});

describe('writeSubjectPropertiesToNeo4j', () => {
  const rows: SubjectPropertyRow[] = [
    { type: 'person', slug: 'prophet-muhammad', graphRank: 0.031, layoutX: 1, layoutY: 2 },
    { type: 'person', slug: 'ali-ibn-abi-talib', graphRank: 0.024, layoutX: 3, layoutY: 4 },
  ];

  beforeEach(() => {
    getDriver.mockClear();
    run.mockReset();
    executeWrite.mockClear();
    close.mockClear();
  });

  it('does nothing (no session opened) for an empty row list', async () => {
    await writeSubjectPropertiesToNeo4j([]);
    expect(getDriver).not.toHaveBeenCalled();
  });

  it('writes via a single UNWIND+MATCH+SET statement inside a write transaction', async () => {
    run.mockResolvedValue({ records: [{ get: (key: string) => (key === 'matched' ? 2 : undefined) }] });

    await writeSubjectPropertiesToNeo4j(rows);

    expect(executeWrite).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledTimes(1);
    const [query, params] = run.mock.calls[0];
    expect(query).toContain('UNWIND $rows AS row');
    // graphRank rides the same statement as the coordinates so a graph-only
    // subject gets both or neither -- docs/graph-subject-search-plan.md ranks
    // suggestions by it, and PostgreSQL has no row to read it from.
    expect(query).toContain('SET n.graphRank = row.graphRank, n.layoutX = row.layoutX, n.layoutY = row.layoutY');
    expect(params).toEqual({ rows });
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('throws when fewer subjects were matched than expected, rather than silently applying a partial map', async () => {
    run.mockResolvedValue({ records: [{ get: (key: string) => (key === 'matched' ? 1 : undefined) }] });

    await expect(writeSubjectPropertiesToNeo4j(rows)).rejects.toThrow('Matched 1 of 2 expected Neo4j subjects');
    // Still closes the session on the error path.
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('closes the session even when the write itself throws', async () => {
    run.mockRejectedValue(new Error('boom'));

    await expect(writeSubjectPropertiesToNeo4j(rows)).rejects.toThrow('boom');
    expect(close).toHaveBeenCalledTimes(1);
  });
});
