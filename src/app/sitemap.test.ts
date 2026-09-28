import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/siteContent', () => ({
  listPersonSlugs: vi.fn(async () => [{ slug: 'abu-bakr', updatedAt: null }]),
  listEventSlugs: vi.fn(async () => [{ slug: 'hijra', updatedAt: new Date('2024-01-01') }]),
  listBattleSlugs: vi.fn(async () => [{ slug: 'badr', updatedAt: new Date('2024-02-01') }]),
  listSourceSlugs: vi.fn(async () => [{ slug: 'siyar-alam-al-nubala', updatedAt: null }]),
}));

import sitemap from './sitemap';

describe('sitemap', () => {
  it('builds absolute URLs for static routes and every record type', async () => {
    const result = await sitemap();
    const urls = result.map((entry) => entry.url);

    expect(urls).toContain('https://namaq.app/');
    expect(urls).toContain('https://namaq.app/people/abu-bakr');
    expect(urls).toContain('https://namaq.app/events/hijra');
    expect(urls).toContain('https://namaq.app/battles/badr');
    expect(urls).toContain('https://namaq.app/sources/siyar-alam-al-nubala');
  });

  it('carries lastModified only when the record has one', async () => {
    const result = await sitemap();

    const event = result.find((entry) => entry.url === 'https://namaq.app/events/hijra');
    const person = result.find((entry) => entry.url === 'https://namaq.app/people/abu-bakr');

    expect(event?.lastModified).toEqual(new Date('2024-01-01'));
    expect(person?.lastModified).toBeUndefined();
  });
});
