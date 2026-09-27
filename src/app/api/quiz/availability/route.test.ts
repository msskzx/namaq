import { beforeEach, describe, expect, it, vi } from 'vitest';

const { availableQuestionCount } = vi.hoisted(() => ({ availableQuestionCount: vi.fn() }));
vi.mock('@/lib/quiz/assemble', () => ({ availableQuestionCount }));

import { GET } from './route';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/quiz/availability', () => {
  it('returns only satisfiable standard lengths', async () => {
    availableQuestionCount.mockResolvedValueOnce(12);
    const response = await GET(new Request('http://localhost/api/quiz/availability?topic=PEOPLE'));
    await expect(response.json()).resolves.toEqual({ available: 12, lengths: [5, 10] });
  });

  it('returns an exact count below the minimum quiz length', async () => {
    availableQuestionCount.mockResolvedValueOnce(2);
    const response = await GET(new Request('http://localhost/api/quiz/availability?topic=AYAT'));
    await expect(response.json()).resolves.toEqual({ available: 2, lengths: [] });
  });

  it('requires a person for a person-circle count', async () => {
    const response = await GET(new Request('http://localhost/api/quiz/availability?topic=PERSON_CIRCLE'));
    expect(response.status).toBe(400);
    expect(availableQuestionCount).not.toHaveBeenCalled();
  });
});
