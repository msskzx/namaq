import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abuBardahIbnNiyar = {
  kind: 'PERSON',
  slug: 'abu-bardah-ibn-niyar',
  name: 'أبو بردة بن نيار',
  nameTransliterated: 'Abu Bardah ibn Niyar',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'niyar-ibn-amr-al-balawi', claims: legacyUnreviewed },
    { type: 'MATERNAL_UNCLE', inverse: 'MATERNAL_NEPHEW', to: 'al-baraa-ibn-azib', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abuBardahIbnNiyar;
