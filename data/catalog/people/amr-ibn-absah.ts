import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData12.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker.
 */
const amrIbnAbsah = {
  kind: 'PERSON',
  slug: 'amr-ibn-absah',
  name: 'عمرو بن عبسة',
  nameTransliterated: 'Amr ibn Absah',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عمرو بن عبسة بن خالد بن حذيفة السلمي البجلي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default amrIbnAbsah;
