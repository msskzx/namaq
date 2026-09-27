import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abbadIbnAlMuttalib = {
  kind: 'PERSON',
  slug: 'abbad-ibn-al-muttalib',
  name: 'عباد بن المطلب',
  nameTransliterated: 'Abbad ibn Al Muttalib',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-muttalib-ibn-abd-manaf', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abbadIbnAlMuttalib;
