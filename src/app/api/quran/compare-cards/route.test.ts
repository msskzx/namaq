import { describe, expect, it } from 'vitest';
import { GET } from './route';
import { pairCards } from '@/app/quran/compare/pairCards';

describe('GET /api/quran/compare-cards', () => {
  it('returns the cards of a pair in either order', async () => {
    const response = GET(new Request('http://x/api/quran/compare-cards?a=26&b=7'));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(JSON.parse(JSON.stringify(pairCards(7, 26))));
  });

  it('refuses a surah out of range', () => {
    expect(GET(new Request('http://x/api/quran/compare-cards?a=0&b=7')).status).toBe(400);
  });
});
