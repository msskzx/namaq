import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const ummKulthumBintUqbah = {
  kind: 'PERSON',
  slug: 'umm-kulthum-bint-uqbah',
  name: 'أم كلثوم بنت عقبة',
  nameTransliterated: 'Umm Kulthum bint Uqbah',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'uqba-ibn-abi-muayt', claims: legacyUnreviewed },
    { type: 'WIFE', inverse: 'HUSBAND', to: 'zaid-ibn-harithah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ummKulthumBintUqbah;
