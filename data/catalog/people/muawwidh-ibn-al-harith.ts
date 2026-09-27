import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const muawwidhIbnAlHarith = {
  kind: 'PERSON',
  slug: 'muawwidh-ibn-al-harith',
  name: 'معوذ بن الحارث',
  nameTransliterated: 'Muawwidh ibn al-Harith',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-harith-ibn-rifaah-al-najjari', claims: legacyUnreviewed },
    { type: 'SON', inverse: 'MOTHER', to: 'afra-bint-ubayd', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default muawwidhIbnAlHarith;
