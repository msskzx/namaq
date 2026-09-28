import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData13.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. Carried the Prophet's letter to Heraclius.
 */
const dihyahAlKalbi = {
  kind: 'PERSON',
  slug: 'dihyah-al-kalbi',
  name: 'دحية الكلبي',
  nameTransliterated: 'Dihyah al-Kalbi',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'دحية بن خليفة بن فروة بن فضالة الكلبي القضاعي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default dihyahAlKalbi;
