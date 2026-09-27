import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const alAwwamIbnKhuwaylid = {
  kind: 'PERSON',
  slug: 'al-awwam-ibn-khuwaylid',
  name: 'العوام بن خويلد',
  nameTransliterated: 'Al Awwam ibn Khuwaylid',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'khuwaylid-ibn-asad', claims: legacyUnreviewed },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'safiyyah-bint-abd-al-muttalib', claims: legacyUnreviewed },
    { type: 'BROTHER', inverse: 'BROTHER', to: 'hizam-ibn-khuwaylid', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alAwwamIbnKhuwaylid;
