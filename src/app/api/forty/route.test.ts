import { describe, expect, it } from 'vitest';
import { GET } from './route';

const get = (query = '') => GET(new Request(`http://localhost/api/forty${query}`));

describe('GET /api/forty', () => {
  it('lists the Forty to search, then sends one whole with its records and Ibn Rajab', async () => {
    const list = await (await get()).json();
    expect(list.length).toBe(50); // the Forty and the eight Ibn Rajab adds
    expect(list[0].start.length).toBeGreaterThan(0);
    const page = await (await get('?n=1')).json();
    expect(page.entry.n).toBe(1);
    expect(page.entry.records.length).toBeGreaterThan(0);
    expect(page.chapter.paragraphs.length).toBeGreaterThan(0);
    expect(page.size.width).toBeGreaterThan(0);
    expect((await get('?n=99')).status).toBe(404);
  });
});
