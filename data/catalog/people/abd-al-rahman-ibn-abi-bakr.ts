import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abdAlRahmanIbnAbiBakr = {
  kind: 'PERSON',
  slug: 'abd-al-rahman-ibn-abi-bakr',
  name: 'عبد الرحمن بن أبي بكر',
  nameTransliterated: 'Abd al-Rahman ibn Abi Bakr',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'BROTHER', inverse: 'SISTER', to: 'aisha-bint-abi-bakr', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdAlRahmanIbnAbiBakr;
