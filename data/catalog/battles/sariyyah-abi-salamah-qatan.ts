import type { CatalogBattle } from '@/lib/catalog/types';

/**
 * The expedition year four opens with. The old seed never had it, so the
 * catalog creates the row — the way the sira's other سرايا reach the app.
 *
 * A سرية by the book's own word: the heading is سرية أبي سلمة إلى قطن and the
 * Prophet sent him with a لواء rather than going himself, which is the
 * distinction src/lib/catalog/types.ts draws between غزوة and سرية.
 */
const sariyyahAbiSalamahQatan = {
  kind: 'BATTLE',
  slug: 'sariyyah-abi-salamah-qatan',
  name: 'سرية أبي سلمة إلى قطن',
  nameTransliterated: "Expedition of Abu Salamah to Qatan",
  fields: {
    engagement: { value: 'SARIYYAH', claims: ['abu-salamah/sariyyah-qatan'] },
    hijriYear: { value: 4, claims: ['abu-salamah/sariyyah-qatan'] },
    location: { value: 'قَطَن', claims: ['abu-salamah/sariyyah-qatan'] },
    muslimForceCount: { value: 150, claims: ['abu-salamah/sariyyah-qatan'] },
  },
  participants: [{ person: 'abu-salamah', isMuslim: true, claims: ['abu-salamah/sariyyah-qatan'] }],
} satisfies CatalogBattle;

export default sariyyahAbiSalamahQatan;
