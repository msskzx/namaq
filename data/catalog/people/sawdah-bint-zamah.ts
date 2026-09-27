import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const sawdahBintZamah = {
  kind: 'PERSON',
  slug: 'sawdah-bint-zamah',
  name: 'سودة بنت زمعة',
  nameTransliterated: 'Sawdah bint Zam\'ah',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'zamah-ibn-qais-al-amiri', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default sawdahBintZamah;
