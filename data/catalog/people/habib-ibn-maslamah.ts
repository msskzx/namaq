import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData15.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker.
 */
const habibIbnMaslamah = {
  kind: 'PERSON',
  slug: 'habib-ibn-maslamah',
  name: 'حبيب بن مسلمة',
  nameTransliterated: 'Habib ibn Maslamah',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'حبيب بن مسلمة بن مالك القرشي الفهري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default habibIbnMaslamah;
