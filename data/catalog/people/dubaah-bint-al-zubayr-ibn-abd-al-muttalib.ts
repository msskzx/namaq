import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const dubaahBintAlZubayrIbnAbdAlMuttalib = {
  kind: 'PERSON',
  slug: 'dubaah-bint-al-zubayr-ibn-abd-al-muttalib',
  name: 'ضباعة بنت الزبير',
  nameTransliterated: 'Dubaah bint al-Zubayr ibn Abd al-Muttalib',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'al-zubayr-ibn-abd-al-muttalib-al-hashimi', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default dubaahBintAlZubayrIbnAbdAlMuttalib;
