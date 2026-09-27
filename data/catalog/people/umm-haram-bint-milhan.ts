import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const ummHaramBintMilhan = {
  kind: 'PERSON',
  slug: 'umm-haram-bint-milhan',
  name: 'أم حرام',
  nameTransliterated: 'Umm Haram bint Milhan',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'milhan-ibn-khalid-al-najjari', claims: legacyUnreviewed },
    { type: 'SISTER', inverse: 'SISTER', to: 'umm-sulaym-al-ghumaysa', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ummHaramBintMilhan;
