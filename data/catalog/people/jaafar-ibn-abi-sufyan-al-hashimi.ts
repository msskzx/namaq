import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Not to be confused with a son of Abu Sufyan ibn Harb (Umayyad) — this is
 * the son of Abu Sufyan ibn al-Harith (Hashimite): the retired
 * prisma/personSeedData5.ts entry noted the source places them back-to-back,
 * both steadfast at Hunayn together.
 */
const jaafarIbnAbiSufyanAlHashimi = {
  kind: 'PERSON',
  slug: 'jaafar-ibn-abi-sufyan-al-hashimi',
  name: 'جعفر بن أبي سفيان',
  nameTransliterated: 'Jaafar ibn Abi Sufyan al-Hashimi',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'جعفر بن أبي سفيان المغيرة بن الحارث بن عبد المطلب بن هاشم القرشي الهاشمي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abu-sufyan-ibn-al-harith', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default jaafarIbnAbiSufyanAlHashimi;
