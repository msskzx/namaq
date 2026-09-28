import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const jaafarIbnAbiTalib = {
  kind: 'PERSON',
  slug: 'jaafar-ibn-abi-talib',
  name: 'جعفر بن أبي طالب',
  nameTransliterated: 'Jaafar ibn Abi Talib',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'جعفر بن أبي طالب عبد مناف بن عبد المطلب بن هاشم بن عبد مناف بن قصي القرشي الهاشمي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abu-talib', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default jaafarIbnAbiTalib;
