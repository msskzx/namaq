import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData12.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. Brothers Abu Hind al-Dari and Nu'aym al-Dari, both mentioned on
 * his own page, are not yet in this pipeline -- no relation modelled.
 */
const tamimAlDari = {
  kind: 'PERSON',
  slug: 'tamim-al-dari',
  name: 'تميم الداري',
  nameTransliterated: 'Tamim al-Dari',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'تميم بن أوس بن خارجة بن سود بن جذيمة اللخمي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default tamimAlDari;
