import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findUnique } = vi.hoisted(() => ({ findUnique: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { title: { findUnique } } }));

import { GET } from './route';

function call(slug: string) {
  return GET(new Request(`http://localhost/api/titles/${slug}`), { params: Promise.resolve({ slug }) });
}

describe('GET /api/titles/[slug]', () => {
  beforeEach(() => {
    findUnique.mockReset();
  });

  it('returns the title with its people', async () => {
    const title = { id: '1', slug: 'sahabi', people: [] };
    findUnique.mockResolvedValue(title);

    const response = await call('sahabi');
    const body = await response.json();

    expect(findUnique).toHaveBeenCalledWith({
      where: { slug: 'sahabi' },
      include: { people: true },
    });
    expect(response.status).toBe(200);
    expect(body).toEqual(title);
  });

  it('returns 404 when no title matches the slug', async () => {
    findUnique.mockResolvedValue(null);

    const response = await call('missing');

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Not found' });
  });

  it('returns 500 when the database call fails', async () => {
    findUnique.mockRejectedValue(new Error('boom'));

    const response = await call('sahabi');

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch title' });
  });
});
