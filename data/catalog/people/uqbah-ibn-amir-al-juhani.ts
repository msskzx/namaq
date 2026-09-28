import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData12.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. No nasab beyond tribe given on his own page.
 */
const uqbahIbnAmirAlJuhani = {
  kind: 'PERSON',
  slug: 'uqbah-ibn-amir-al-juhani',
  name: 'عقبة بن عامر الجهني',
  nameTransliterated: 'Uqbah ibn Amir al-Juhani',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عقبة بن عامر الجهني',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default uqbahIbnAmirAlJuhani;
