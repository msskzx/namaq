import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const abiHuzaymahIbnThalabah = {
  kind: 'PERSON',
  slug: 'abi-huzaymah-ibn-thalabah',
  name: 'أبو حزيمة بن ثعلبة',
  nameTransliterated: 'Abi Huzaymah ibn Thalabah',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'harithah-ibn-abi-huzaymah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abiHuzaymahIbnThalabah;
