import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const awsIbnThabit = {
  kind: 'PERSON',
  slug: 'aws-ibn-thabit',
  name: 'أوس بن ثابت',
  nameTransliterated: 'Aws ibn Thabit',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'thabit-ibn-al-mundhir', claims: legacyUnreviewed },
    { type: 'BROTHER', inverse: 'BROTHER', to: 'hassan-ibn-thabit', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default awsIbnThabit;
