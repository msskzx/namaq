import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const durrahBintAbiLahab = {
  kind: 'PERSON',
  slug: 'durrah-bint-abi-lahab',
  name: 'درة بنت أبي لهب',
  nameTransliterated: 'Durrah bint Abi Lahab',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'abu-lahab-ibn-abd-al-muttalib', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default durrahBintAbiLahab;
