import { describe, expect, it } from 'vitest';
import nextConfig from './next.config';

describe('redirects', () => {
  it('sends /quran/shifts permanently to /quran', async () => {
    expect(await nextConfig.redirects!()).toContainEqual({ source: '/quran/shifts', destination: '/quran', permanent: true });
  });

  it('sends /quran/musa permanently to its prophet page', async () => {
    expect(await nextConfig.redirects!()).toContainEqual({ source: '/quran/musa', destination: '/quran/prophets/musa', permanent: true });
  });

  it('sends /references permanently to /attributions', async () => {
    expect(await nextConfig.redirects!()).toContainEqual({ source: '/references', destination: '/attributions', permanent: true });
  });
});
