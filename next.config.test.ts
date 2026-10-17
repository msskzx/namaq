import { describe, expect, it } from 'vitest';
import nextConfig from './next.config';

describe('redirects', () => {
  it('sends /quran/shifts permanently to /quran/compare', async () => {
    expect(await nextConfig.redirects!()).toContainEqual({ source: '/quran/shifts', destination: '/quran/compare', permanent: true });
  });

  it('sends the old repetition links on /quran, which carry s, to /quran/compare', async () => {
    expect(await nextConfig.redirects!()).toContainEqual({ source: '/quran', has: [{ type: 'query', key: 's' }], destination: '/quran/compare', permanent: true });
  });

  it('sends /quran/musa permanently to its prophet page', async () => {
    expect(await nextConfig.redirects!()).toContainEqual({ source: '/quran/musa', destination: '/quran/prophets/musa', permanent: true });
  });

  it('sends /references permanently to /attributions', async () => {
    expect(await nextConfig.redirects!()).toContainEqual({ source: '/references', destination: '/attributions', permanent: true });
  });
});
