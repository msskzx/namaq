import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abdAlAsadIbnHilal = {
  kind: 'PERSON',
  slug: 'abd-al-asad-ibn-hilal',
  name: 'عبد الأسد بن هلال',
  nameTransliterated: 'Abd Al Asad ibn Hilal',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'hilal-ibn-abdullah-al-makhzumi', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdAlAsadIbnHilal;
