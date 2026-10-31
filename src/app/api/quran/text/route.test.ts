import { describe, expect, it } from 'vitest';
import { GET, dynamic } from './route';

describe('/api/quran/text', () => {
  it('serves every ayah once, built at deploy time', async () => {
    const ayat = await (await GET()).json();
    expect(dynamic).toBe('force-static');
    expect(ayat).toHaveLength(6236);
    expect(ayat.find((ayah: { key: string }) => ayah.key === '2:255')).toMatchObject({ key: '2:255', page: 42 });
  });
});
