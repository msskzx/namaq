import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Mother al-Furayah bint Khunays, per the retired prisma/personSeedData12.ts
 * entry (his epithet "Ibn al-Furayah" derives from her), is not modelled --
 * no further chain given for her. His brother Aws ibn Thabit's own module
 * already declares that sibling edge, making Shaddad ibn Aws (Aws's son)
 * Hassan's nephew without a direct edge needed here. Son Abd al-Rahman is
 * not yet in this pipeline.
 */
const hassanIbnThabit = {
  kind: 'PERSON',
  slug: 'hassan-ibn-thabit',
  name: 'حسان بن ثابت',
  nameTransliterated: 'Hassan ibn Thabit',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'حسان بن ثابت بن المنذر بن حرام بن عمرو بن زيد مناة بن عدي بن عمرو بن مالك بن النجار الأنصاري الخزرجي النجاري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'thabit-ibn-al-mundhir', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default hassanIbnThabit;
