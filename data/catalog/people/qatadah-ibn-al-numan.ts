import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData11.ts entry. Maternal
 * brother of Abu Said al-Khudri, not yet in this pipeline, so no relation
 * is modelled. Famous for his eye being restored by the Prophet's hand
 * after Uhud.
 */
const qatadahIbnAlNuman = {
  kind: 'PERSON',
  slug: 'qatadah-ibn-al-numan',
  name: 'قتادة بن النعمان',
  nameTransliterated: 'Qatadah ibn al-Numan',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: { value: 'قتادة بن النعمان بن زيد بن عامر الأنصاري الظفري', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default qatadahIbnAlNuman;
