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

import { writeNasabRankToNeo4j } from './computeNasabRanks';

describe('writeNasabRankToNeo4j', () => {
  const ranks = [
    { slug: 'prophet-muhammad', rank: 1 },
    { slug: 'ali-ibn-abi-talib', rank: 2 },
  ];

  beforeEach(() => {
    getDriver.mockClear();
    run.mockReset();
    executeWrite.mockClear();
    close.mockClear();
  });

  it('does nothing for an empty rank list', async () => {
    await writeNasabRankToNeo4j([]);
    expect(getDriver).not.toHaveBeenCalled();
  });

  it('writes via a single UNWIND+MATCH+SET statement', async () => {
    run.mockResolvedValue({ records: [{ get: () => 2 }] });

    await writeNasabRankToNeo4j(ranks);

    const [query, params] = run.mock.calls[0];
    expect(query).toContain('UNWIND $ranks AS row');
    expect(query).toContain('SET p.nasabRank = row.rank');
    expect(params).toEqual({ ranks });
    expect(close).toHaveBeenCalledTimes(1);
  });

  it('throws when fewer people were matched than expected', async () => {
    run.mockResolvedValue({ records: [{ get: () => 1 }] });

    await expect(writeNasabRankToNeo4j(ranks)).rejects.toThrow('Matched 1 of 2 expected Neo4j people');
  });
});
