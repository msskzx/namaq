import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findUnique } = vi.hoisted(() => ({ findUnique: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { battle: { findUnique } } }));

import { GET } from './route';

function call(slug: string) {
  return GET(new Request(`http://localhost/api/battles/${slug}`), { params: Promise.resolve({ slug }) });
}

describe('GET /api/battles/[slug]', () => {
  beforeEach(() => {
    findUnique.mockReset();
  });

  it('returns the battle with participants', async () => {
    const battle = { id: '1', slug: 'badr', participations: [] };
    findUnique.mockResolvedValue(battle);

    const response = await call('badr');
    const body = await response.json();

    expect(findUnique).toHaveBeenCalledWith({
      where: { slug: 'badr' },
      include: {
        participations: {
          include: {
            person: { select: { id: true, name: true, nameTransliterated: true, slug: true } },
          },
        },
      },
    });
    expect(response.status).toBe(200);
    expect(body).toEqual(battle);
  });

  it('returns 404 when no battle matches the slug', async () => {
    findUnique.mockResolvedValue(null);

    const response = await call('missing');

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Not found' });
  });

  it('returns 500 when the database call fails', async () => {
    findUnique.mockRejectedValue(new Error('boom'));

    const response = await call('badr');

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch battle' });
  });
});
