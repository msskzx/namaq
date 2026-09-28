import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData13.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. No nasab beyond his father's name given on his own page.
 */
const huwaytibIbnAbdAlUzza = {
  kind: 'PERSON',
  slug: 'huwaytib-ibn-abd-al-uzza',
  name: 'حويطب بن عبد العزى القرشي',
  nameTransliterated: 'Huwaytib ibn Abd al-Uzza',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'حويطب بن عبد العزى القرشي العامري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default huwaytibIbnAbdAlUzza;
