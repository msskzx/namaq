import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData12.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. Brother of al-Hakam ibn Amr al-Ghifari, whose own module already
 * declares that BROTHER edge -- no relation restated here.
 */
const rafiIbnAmrAlGhifari = {
  kind: 'PERSON',
  slug: 'rafi-ibn-amr-al-ghifari',
  name: 'رافع بن عمرو الغفاري',
  nameTransliterated: 'Rafi ibn Amr al-Ghifari',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'رافع بن عمرو الغفاري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default rafiIbnAmrAlGhifari;
