import { describe, expect, it } from 'vitest';
import { GET } from './route';


const search = async (q: string) => (await GET(new Request(`http://localhost/api/quran/search?q=${encodeURIComponent(q)}`))).json();

describe('/api/quran/search', () => {
  it('answers with the matching ayat and their count', async () => {
    const result = await search('الحي القيوم');
    expect(result.total).toBe(2);
    expect(result.hits.map((hit: { key: string }) => hit.key)).toEqual(['2:255', '3:2']);
  });

  it('answers an empty result to a query too short to search', async () => {
    expect(await search('ق')).toEqual({ total: 0, hits: [] });
  });
});
