import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData12.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. Real name given on his own page: Khalid ibn Zaid; the Prophet
 * lodged with his family on arrival in Medina, before the Prophet's own
 * quarters and mosque were built. His father's chain is not modelled.
 */
const abuAyyubAlAnsari = {
  kind: 'PERSON',
  slug: 'abu-ayyub-al-ansari',
  name: 'أبو أيوب الأنصاري',
  nameTransliterated: 'Abu Ayyub al-Ansari',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'خالد بن زيد بن كليب بن ثعلبة بن عبد عمرو بن عوف بن غنم بن مالك بن النجار بن ثعلبة بن الخزرج',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abuAyyubAlAnsari;
