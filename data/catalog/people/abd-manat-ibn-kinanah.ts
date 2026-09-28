import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abdManatIbnKinanah = {
  kind: 'PERSON',
  slug: 'abd-manat-ibn-kinanah',
  name: 'عبد مناة بن كنانة',
  nameTransliterated: 'Abd Manat ibn Kinanah',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'kinanah-ibn-khuzayma', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdManatIbnKinanah;
