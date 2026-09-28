import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData12.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. Name given as al-Harith ibn Rib'i "per the correct view" (his page
 * also notes two rejected alternatives, al-Nu'man and Amr). Son Abdullah ibn
 * Abi Qatadah, a narrator from him, is not yet in this pipeline.
 */
const abuQatadahAlAnsari = {
  kind: 'PERSON',
  slug: 'abu-qatadah-al-ansari',
  name: 'أبو قتادة الأنصاري',
  nameTransliterated: 'Abu Qatadah al-Ansari',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'الحارث بن ربعي الأنصاري السلمي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abuQatadahAlAnsari;
