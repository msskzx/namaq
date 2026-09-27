import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const alSakranIbnAmrAlAmiri = {
  kind: 'PERSON',
  slug: 'al-sakran-ibn-amr-al-amiri',
  name: 'السكران بن عمرو',
  nameTransliterated: 'Al Sakran ibn Amr Al Amiri',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'HUSBAND', inverse: 'WIFE', to: 'sawdah-bint-zamah', claims: legacyUnreviewed },
    { type: 'BROTHER', inverse: 'BROTHER', to: 'suhail-ibn-amr', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alSakranIbnAmrAlAmiri;
