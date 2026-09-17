import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// The entry is silent about Khandaq, so nothing here is cited yet. The module
// exists to carry the seed's two values rather than to leave them unrecorded.
const khandaq = {
  kind: 'BATTLE',
  slug: 'khandaq',
  fields: { hijriYear: { value: 5, claims: legacyUnreviewed } },
  participants: [{ person: 'talhah-ibn-ubaydullah', isMuslim: true, claims: legacyUnreviewed }],
} satisfies CatalogBattle;

export default khandaq;
