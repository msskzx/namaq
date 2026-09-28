import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData15.ts entry. No fullName
 * given on his own page. Freed slave/client of the Prophet -- was owned by
 * the existing Umm Salamah, who freed him on condition of lifelong service
 * to the Prophet (a manumission arrangement, not a family tie -- not
 * modelled as a relation). Sons Umar and Abd al-Rahman, narrators from
 * him, are not yet in this pipeline.
 */
const safinah = {
  kind: 'PERSON',
  slug: 'safinah',
  name: 'سفينة',
  nameTransliterated: 'Safinah',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default safinah;
