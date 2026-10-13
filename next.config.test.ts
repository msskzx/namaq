import { describe, expect, it } from 'vitest';
import nextConfig from './next.config';

describe('redirects', () => {
  it('sends /quran/shifts permanently to /quran', async () => {
    expect(await nextConfig.redirects!()).toEqual([{ source: '/quran/shifts', destination: '/quran', permanent: true }]);
  });
});
