import { describe, expect, it } from 'vitest';
import { TERMS } from '@/lib/balaghaTerms';
import { GET } from './route';

describe('GET /api/terms', () => {
  it('sends the terms named, by their vocalized or plain names, and nothing for none', async () => {
    const [a, b] = TERMS.terms;
    const response = await GET(new Request(`http://localhost/api/terms?n=${encodeURIComponent(a.name)}&n=${encodeURIComponent(b.name.replace(/[ً-ٰٟ]/g, ''))}`));
    expect((await response.json()).map((term: { name: string }) => term.name)).toEqual([a.name, b.name]);
    expect((await GET(new Request('http://localhost/api/terms?n=nothing'))).status).toBe(404);
  });
});
