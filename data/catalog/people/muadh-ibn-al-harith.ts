import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const muadhIbnAlHarith = {
  kind: 'PERSON',
  slug: 'muadh-ibn-al-harith',
  name: 'معاذ بن الحارث',
  nameTransliterated: 'Muadh ibn al-Harith',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-harith-ibn-rifaah-al-najjari', claims: legacyUnreviewed },
    { type: 'SON', inverse: 'MOTHER', to: 'afra-bint-ubayd', claims: legacyUnreviewed },
    { type: 'BROTHER', inverse: 'BROTHER', to: 'muawwidh-ibn-al-harith', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default muadhIbnAlHarith;
