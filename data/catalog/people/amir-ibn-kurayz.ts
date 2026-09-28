import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const amirIbnKurayz = {
  kind: 'PERSON',
  slug: 'amir-ibn-kurayz',
  name: 'عامر بن كريز',
  nameTransliterated: 'Amir ibn Kurayz',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'kurayz-ibn-rabiah', claims: legacyUnreviewed },
    { type: 'SON', inverse: 'MOTHER', to: 'al-bayda-bint-abd-al-muttalib', claims: legacyUnreviewed },
    { type: 'BROTHER', inverse: 'SISTER', to: 'arwa-bint-kurayz', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default amirIbnKurayz;
