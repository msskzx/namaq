import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData13.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. Son Abd al-Rahman, a narrator from him, is not yet in this
 * pipeline.
 */
const saidIbnYarbuAlQurashi = {
  kind: 'PERSON',
  slug: 'said-ibn-yarbu-al-qurashi',
  name: 'سعيد بن يربوع القرشي',
  nameTransliterated: 'Said ibn Yarbu al-Qurashi',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'سعيد بن يربوع القرشي المخزومي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default saidIbnYarbuAlQurashi;
