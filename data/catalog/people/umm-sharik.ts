import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData10.ts entry. No father
 * given (Ansari, Banu al-Najjar, per her page), so no ancestor chain. Her
 * marriage to the Prophet was not consummated, per the retired entry, over
 * concern for the Ansar's known jealousy in marriage.
 */
const ummSharik = {
  kind: 'PERSON',
  slug: 'umm-sharik',
  name: 'أم شريك',
  nameTransliterated: 'Umm Sharik',
  hasProfile: true,
  fields: {},
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default ummSharik;
