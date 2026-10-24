import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BranchAyah } from '@/lib/quran/branches';

const { loadReaderAyat } = vi.hoisted(() => ({ loadReaderAyat: vi.fn() }));
vi.mock('@/lib/quran/ayahContext', async importOriginal => ({
  ...await importOriginal<typeof import('@/lib/quran/ayahContext')>(),
  loadReaderAyat,
}));

import { GET } from './route';

const all: BranchAyah[] = [
  { key: '1:1', page: 1, words: ['بِسْمِ', 'ٱللَّهِ', 'ٱلرَّحْمَـٰنِ', 'ٱلرَّحِيمِ'] },
  { key: '1:7', page: 1, words: ['وَلَا', 'ٱلضَّآلِّينَ'] },
  { key: '2:1', page: 2, words: ['الٓمٓ'] },
  { key: '2:2', page: 2, words: ['ذَٰلِكَ', 'ٱلْكِتَـٰبُ'] },
];

const request = (query: string) => new Request(`http://localhost/api/quran/surrounding?${query}`);

describe('GET /api/quran/surrounding', () => {
  beforeEach(() => {
    loadReaderAyat.mockReset();
    loadReaderAyat.mockResolvedValue(all);
  });

  it('returns the ayah before and after each requested key, crossing surahs with the basmala', async () => {
    const response = await GET(request('before=2:1,1:1&after=1:7'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      before: { '2:1': { key: '1:7', page: 1, words: all[1].words, basmala: all[0].words }, '1:1': null },
      after: { '1:7': { key: '2:1', page: 2, words: all[2].words, basmala: all[0].words } },
    });
  });

  it.each(['', 'before=2', 'after=0:1', 'before=115:1', 'before=2:1;drop'])('rejects %j', async query => {
    expect((await GET(request(query))).status).toBe(400);
    expect(loadReaderAyat).not.toHaveBeenCalled();
  });

  it('reports a failed corpus load', async () => {
    loadReaderAyat.mockRejectedValue(new Error('gone'));
    expect((await GET(request('before=2:1'))).status).toBe(500);
  });
});
