import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData15.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker.
 */
const zaidIbnArqam = {
  kind: 'PERSON',
  slug: 'zaid-ibn-arqam',
  name: 'زيد بن أرقم',
  nameTransliterated: 'Zaid ibn Arqam',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'زيد بن أرقم بن زيد بن قيس بن النعمان بن مالك الأغر بن ثعلبة بن كعب بن الخزرج بن الحارث بن الخزرج الأنصاري الخزرجي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default zaidIbnArqam;
