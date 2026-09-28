import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData13.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. Kunya used as part of the primary name per the source's own
 * heading; no father's-father chain given. The one who captured al-Abbas
 * at Badr.
 */
const abuAlYusrAlAnsari = {
  kind: 'PERSON',
  slug: 'abu-al-yusr-al-ansari',
  name: 'أبو اليسر كعب بن عمرو الأنصاري',
  nameTransliterated: 'Abu al-Yusr al-Ansari',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'كعب بن عمرو الأنصاري السلمي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abuAlYusrAlAnsari;
