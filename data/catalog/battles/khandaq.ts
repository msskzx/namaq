import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// Neither entry mentions Khandaq, so nothing here is cited. The module exists
// to carry what the retired seed rows held rather than lose it.
const khandaq = {
  kind: 'BATTLE',
  slug: 'khandaq',
  fields: { hijriYear: { value: 5, claims: legacyUnreviewed } },
  participants: [
    { person: 'talhah-ibn-ubaydullah', isMuslim: true, claims: legacyUnreviewed },
    { person: 'abu-ubaydah-ibn-al-jarrah', isMuslim: true, claims: legacyUnreviewed },
  ],
} satisfies CatalogBattle;

export default khandaq;
