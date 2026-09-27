import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const jaafarIbnAbiSufyanAlHashimi = {
  kind: 'PERSON',
  slug: 'jaafar-ibn-abi-sufyan-al-hashimi',
  name: 'جعفر بن أبي سفيان',
  nameTransliterated: 'Jaafar ibn Abi Sufyan al-Hashimi',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abu-sufyan-ibn-al-harith', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default jaafarIbnAbiSufyanAlHashimi;
