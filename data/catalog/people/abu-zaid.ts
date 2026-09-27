import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abuZaid = {
  kind: 'PERSON',
  slug: 'abu-zaid',
  name: 'أبو زيد',
  nameTransliterated: 'Abu Zaid',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'ثابت بن زيد بن قيس بن زيد بن النعمان بن مالك بن ثعلبة بن كعب بن الخزرج الأنصاري الخزرجي الحارثي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'zayd-ibn-qais', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abuZaid;
