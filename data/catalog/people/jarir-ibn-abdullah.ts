import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData13.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker.
 */
const jarirIbnAbdullah = {
  kind: 'PERSON',
  slug: 'jarir-ibn-abdullah',
  name: 'جرير بن عبد الله',
  nameTransliterated: 'Jarir ibn Abdullah',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'جرير بن عبد الله بن جابر بن مالك بن نصر بن ثعلبة بن جشم بن عوف البجلي القسري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default jarirIbnAbdullah;
