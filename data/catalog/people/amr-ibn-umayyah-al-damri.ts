import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData15.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. Sons Jafar and Abdullah, and nephew al-Zibriqan ibn Abdullah,
 * narrators from him, are not yet in this pipeline.
 */
const amrIbnUmayyahAlDamri = {
  kind: 'PERSON',
  slug: 'amr-ibn-umayyah-al-damri',
  name: 'عمرو بن أمية',
  nameTransliterated: 'Amr ibn Umayyah al-Damri',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عمرو بن أمية بن خويلد بن عبد الله بن إياس الضمري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default amrIbnUmayyahAlDamri;
