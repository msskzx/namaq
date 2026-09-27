import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const khubaybIbnYasaf = {
  kind: 'PERSON',
  slug: 'khubayb-ibn-yasaf',
  name: 'خبيب بن يساف',
  nameTransliterated: 'Khubayb ibn Yasaf',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'خبيب بن يساف بن عنبة بن عمرو بن خديج بن عامر بن جشم بن الحارث الأنصاري الخزرجي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'yasaf-ibn-inabah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default khubaybIbnYasaf;
