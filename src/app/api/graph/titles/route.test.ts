import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { title: { findMany } } }));

import { GET } from './route';

describe('GET /api/graph/titles', () => {
  beforeEach(() => {
    findMany.mockReset();
  });

  it('builds a bipartite graph of titles and their people', async () => {
    findMany.mockResolvedValue([
      {
        id: 't1',
        slug: 'prophet',
        name: 'نبي',
        people: [
          { id: 'p1', slug: 'prophet-muhammad', name: 'Muhammad', nasabRank: 1 },
          { id: 'p2', slug: 'adam', name: 'Adam', nasabRank: null },
        ],
      },
      {
        id: 't2',
        slug: 'messenger',
        name: 'رسول',
        people: [{ id: 'p1', slug: 'prophet-muhammad', name: 'Muhammad', nasabRank: 1 }],
      },
    ]);

    const response = await GET();
    const body = await response.json();

    expect(findMany).toHaveBeenCalledWith({
      include: { people: { select: { id: true, name: true, slug: true, nasabRank: true } } },
      orderBy: { name: 'asc' },
    });
    expect(response.status).toBe(200);

    expect(body.nodes).toHaveLength(4);
    expect(body.nodes).toEqual(expect.arrayContaining([
      { id: 'title:t1', label: 'نبي', slug: 'prophet', group: 1, type: 'title' },
      { id: 'title:t2', label: 'رسول', slug: 'messenger', group: 1, type: 'title' },
      { id: 'person:p1', label: 'Muhammad', slug: 'prophet-muhammad', group: 2, type: 'person', nasabRank: 1 },
      { id: 'person:p2', label: 'Adam', slug: 'adam', group: 2, type: 'person', nasabRank: null },
    ]));

    // Muhammad appears once but links to both titles; the shared person node isn't duplicated.
    expect(body.links).toEqual(expect.arrayContaining([
      { source: 'person:p1', target: 'title:t1', label: 'HAS_TITLE', value: 1 },
      { source: 'person:p2', target: 'title:t1', label: 'HAS_TITLE', value: 1 },
      { source: 'person:p1', target: 'title:t2', label: 'HAS_TITLE', value: 1 },
    ]));
    expect(body.links).toHaveLength(3);
  });

  it('returns 500 when the database call fails', async () => {
    findMany.mockRejectedValue(new Error('boom'));

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch titles graph data' });
  });
});
