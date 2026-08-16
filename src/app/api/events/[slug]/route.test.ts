import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findUnique } = vi.hoisted(() => ({ findUnique: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { event: { findUnique } } }));

import { GET } from './route';

function call(slug: string) {
  return GET(new Request(`http://localhost/api/events/${slug}`), { params: Promise.resolve({ slug }) });
}

describe('GET /api/events/[slug]', () => {
  beforeEach(() => {
    findUnique.mockReset();
  });

  it('returns 400 when the slug is empty', async () => {
    const response = await call('');

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Event slug is required' });
    expect(findUnique).not.toHaveBeenCalled();
  });

  it('returns the event with its people and battle', async () => {
    const event = { id: '1', slug: 'battle-of-badr' };
    findUnique.mockResolvedValue(event);

    const response = await call('battle-of-badr');
    const body = await response.json();

    expect(findUnique).toHaveBeenCalledWith({
      where: { slug: 'battle-of-badr' },
      include: expect.objectContaining({
        people: expect.any(Object),
        battle: expect.any(Object),
      }),
    });
    expect(response.status).toBe(200);
    expect(body).toEqual(event);
  });

  it('returns 404 when no event matches the slug', async () => {
    findUnique.mockResolvedValue(null);

    const response = await call('missing');

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'Event not found' });
  });

  it('returns 500 when the database call fails', async () => {
    findUnique.mockRejectedValue(new Error('boom'));

    const response = await call('battle-of-badr');

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to fetch event' });
  });
});
