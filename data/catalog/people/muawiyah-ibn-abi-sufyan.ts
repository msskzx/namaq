import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. fullName and the companion title
 * are carried from the retired prisma/personSeedData15.ts entry.
 */
const muawiyahIbnAbiSufyan = {
  kind: 'PERSON',
  slug: 'muawiyah-ibn-abi-sufyan',
  name: 'معاوية بن أبي سفيان',
  nameTransliterated: 'Muawiyah ibn Abi Sufyan',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'صخر بن حرب بن أمية بن عبد شمس بن عبد مناف بن قصي بن كلاب القرشي الأموي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abu-sufyan-ibn-harb', claims: legacyUnreviewed },
    { type: 'SON', inverse: 'MOTHER', to: 'hind-bint-utbah', claims: legacyUnreviewed },
    { type: 'BROTHER', inverse: 'SISTER', to: 'umm-habibah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default muawiyahIbnAbiSufyan;
