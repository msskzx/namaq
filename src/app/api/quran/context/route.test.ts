import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { BranchAyah } from '@/lib/quran/branches';

const { loadReaderAyat } = vi.hoisted(() => ({ loadReaderAyat: vi.fn() }));
vi.mock('@/lib/quran/readerAyat', () => ({ loadReaderAyat }));

import { GET } from './route';

const all: BranchAyah[] = [
  { key: '94:4', page: 596, words: ['وَرَفَعْنَا', 'لَكَ', 'ذِكْرَكَ'] },
  { key: '94:5', page: 596, words: ['فَإِنَّ', 'مَعَ', 'ٱلْعُسْرِ', 'يُسْرًا'] },
  { key: '94:6', page: 596, words: ['إِنَّ', 'مَعَ', 'ٱلْعُسْرِ', 'يُسْرًۭا'] },
  { key: '94:7', page: 596, words: ['فَإِذَا', 'فَرَغْتَ', 'فَٱنصَبْ'] },
];

const request = (keys?: string) => new Request(`http://localhost/api/quran/context${keys === undefined ? '' : `?q=${encodeURIComponent(keys)}`}`);

describe('GET /api/quran/context', () => {
  beforeEach(() => {
    loadReaderAyat.mockReset();
    loadReaderAyat.mockResolvedValue(all);
  });

  it('returns one context card per requested ayah in Quran order with original marks', async () => {
    const response = await GET(request('94:6,94:5,94:6'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([
      { ayah: all[1], before: all[0], after: all[2], match: { exact: [1, 2, 3], rooted: [0] } },
      { ayah: all[2], before: all[1], after: all[3], match: { exact: [1, 2, 3], rooted: [0] } },
    ]);
  });

  it.each([undefined, '', ' ', '94', '94:0', '0:1', '115:1', '-1:1', '94:-1', '94:1.5', '94:5x', '94:5,', '94:5,,94:6', '94:5:6', '94:5,garbage', '094:5', '94:05', '94:9007199254740992'])(
    'rejects invalid keys %s before loading the corpus', async keys => {
      const response = await GET(request(keys));

      expect(response.status).toBe(400);
      expect(loadReaderAyat).not.toHaveBeenCalled();
    },
  );

  it('leaves a single requested ayah without marks', async () => {
    const body = await (await GET(request('94:5'))).json();
    expect(body).toEqual([{ ayah: all[1], before: all[0], after: all[2] }]);
  });

  it('rejects more than 200 keys before loading the corpus', async () => {
    const keys = Array.from({ length: 201 }, (_, i) => `2:${i + 1}`).join(',');
    expect((await GET(request(keys))).status).toBe(400);
    expect(loadReaderAyat).not.toHaveBeenCalled();
  });

  it('returns 404 if any requested ayah is absent instead of returning partial cards', async () => {
    const response = await GET(request('94:5,94:999'));

    expect(response.status).toBe(404);
  });

  it('returns 500 if the original reader corpus cannot be loaded', async () => {
    loadReaderAyat.mockRejectedValue(new Error('reader unavailable'));

    expect((await GET(request('94:5'))).status).toBe(500);
  });
});
