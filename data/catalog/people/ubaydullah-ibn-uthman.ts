import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const ubaydullahIbnUthman = {
  kind: 'PERSON',
  slug: 'ubaydullah-ibn-uthman',
  name: 'عبيد الله بن عثمان',
  nameTransliterated: 'Ubaydullah ibn Uthman',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'uthman-ibn-amr', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ubaydullahIbnUthman;
