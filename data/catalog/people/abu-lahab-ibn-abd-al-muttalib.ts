import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abuLahabIbnAbdAlMuttalib = {
  kind: 'PERSON',
  slug: 'abu-lahab-ibn-abd-al-muttalib',
  name: 'أبو لهب',
  nameTransliterated: 'Abu Lahab Ibn Abd Al Muttalib',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abd-al-muttalib-ibn-hashim', claims: legacyUnreviewed },
    { type: 'BROTHER', inverse: 'SISTER', to: 'atikah-bint-abd-al-muttalib', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abuLahabIbnAbdAlMuttalib;
