import { describe, expect, it } from 'vitest';
import robots from './robots';

describe('robots', () => {
  it('allows crawling of public content and points to the sitemap', () => {
    const result = robots();

    expect(result.rules).toEqual({
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    });
    expect(result.sitemap).toMatch(/\/sitemap\.xml$/);
  });
});
