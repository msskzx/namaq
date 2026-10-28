import { describe, expect, it, vi } from 'vitest';

vi.mock('../PartyRoom', () => ({ default: () => null }));

import { generateMetadata } from './page';

describe('party link preview', () => {
  it('invites to a party game by its code', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ code: '123456' }) });
    expect(meta.openGraph).toMatchObject({ title: 'مسابقة جماعية في نَمَق', description: 'انضم إلى المسابقة بالرمز 123456', images: [{ url: '/opengraph-image.png' }] });
  });
});
