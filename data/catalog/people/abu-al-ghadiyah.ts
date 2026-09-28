import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData13.ts entry. Tribe disputed
 * between Muzaynah and Juhaynah, and no father's name given at all, so no
 * fullName is recorded rather than guessing. Son Sad, a narrator from him,
 * is not yet in this pipeline.
 */
const abuAlGhadiyah = {
  kind: 'PERSON',
  slug: 'abu-al-ghadiyah',
  name: 'أبو الغادية الصحابي',
  nameTransliterated: 'Abu al-Ghadiyah',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abuAlGhadiyah;
