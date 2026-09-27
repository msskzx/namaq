import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData15.ts entry. Maternal
 * uncle is the existing companion Abu Bardah ibn Niyar, whose own module
 * already declares that MATERNAL_UNCLE/MATERNAL_NEPHEW edge. The final
 * entry in the source's Companions section.
 */
const alBaraaIbnAzib = {
  kind: 'PERSON',
  slug: 'al-baraa-ibn-azib',
  name: 'البراء بن عازب',
  nameTransliterated: 'Al-Baraa ibn Azib',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'البراء بن عازب بن الحارث الأنصاري الحارثي المدني',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default alBaraaIbnAzib;
