import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const arwaBintKurayz = {
  kind: 'PERSON',
  slug: 'arwa-bint-kurayz',
  name: 'أروى بنت كريز',
  nameTransliterated: 'Arwa Bint Kurayz',
  hasProfile: false,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'DAUGHTER', inverse: 'MOTHER', to: 'al-bayda-bint-abd-al-muttalib', claims: legacyUnreviewed },
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'kurayz-ibn-rabiah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default arwaBintKurayz;
