import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData14.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. Freed slave/client of the Prophet. Sons Ubaydullah, Abd
 * al-Rahman, Abd al-Aziz, and Muslim, narrators from him, are not yet in
 * this pipeline.
 */
const abuBakrahAlThaqafi = {
  kind: 'PERSON',
  slug: 'abu-bakrah-al-thaqafi',
  name: 'أبو بكرة الثقفي',
  nameTransliterated: 'Abu Bakrah al-Thaqafi',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'نفيع بن الحارث الثقفي الطائفي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abuBakrahAlThaqafi;
