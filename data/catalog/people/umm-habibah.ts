import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const ummHabibah = {
  kind: 'PERSON',
  slug: 'umm-habibah',
  name: 'أم حبيبة',
  nameTransliterated: 'Umm Habibah',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'abu-sufyan-ibn-harb', claims: legacyUnreviewed },
    { type: 'DAUGHTER', inverse: 'MOTHER', to: 'hind-bint-utbah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ummHabibah;
