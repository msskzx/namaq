import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData14.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. Son Abd al-Rahman, a narrator from him, is not yet in this
 * pipeline.
 */
const muawiyahIbnHudayj = {
  kind: 'PERSON',
  slug: 'muawiyah-ibn-hudayj',
  name: 'معاوية بن حديج',
  nameTransliterated: 'Muawiyah ibn Hudayj',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'معاوية بن حديج بن جفنة بن قتيرة الكندي السكوني',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default muawiyahIbnHudayj;
