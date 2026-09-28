import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const bishrIbnWaqsh = {
  kind: 'PERSON',
  slug: 'bishr-ibn-waqsh',
  name: 'بشر بن وقش',
  nameTransliterated: 'Bishr ibn Waqsh',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'waqsh-ibn-zughbah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default bishrIbnWaqsh;
