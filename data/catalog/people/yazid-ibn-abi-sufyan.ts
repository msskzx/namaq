import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const yazidIbnAbiSufyan = {
  kind: 'PERSON',
  slug: 'yazid-ibn-abi-sufyan',
  name: 'يزيد بن أبي سفيان',
  nameTransliterated: 'Yazid ibn Abi Sufyan',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'يزيد بن أبي سفيان صخر بن حرب بن أمية بن عبد شمس بن عبد مناف القرشي الأموي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abu-sufyan-ibn-harb', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default yazidIbnAbiSufyan;
