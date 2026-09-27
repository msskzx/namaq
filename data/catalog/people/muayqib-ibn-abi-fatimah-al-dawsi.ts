import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData12.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. Ally (not blood kin) of Banu Abd Shams -- no ancestor chain
 * modelled. Grandson Iyas ibn al-Harith ibn Muayqib, a narrator from him,
 * is not yet in this pipeline.
 */
const muayqibIbnAbiFatimahAlDawsi = {
  kind: 'PERSON',
  slug: 'muayqib-ibn-abi-fatimah-al-dawsi',
  name: 'معيقيب بن أبي فاطمة الدوسي',
  nameTransliterated: 'Muayqib ibn Abi Fatimah al-Dawsi',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'معيقيب بن أبي فاطمة الدوسي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default muayqibIbnAbiFatimahAlDawsi;
