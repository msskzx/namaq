import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Brother of Safwan ibn Bayda (previous entry) and of Sahl ibn Bayda, per
 * the retired prisma/personSeedData7.ts entry -- Sahl is not separately
 * profiled here.
 */
const suhailIbnBayda = {
  kind: 'PERSON',
  slug: 'suhail-ibn-bayda',
  name: 'سهيل ابن بيضاء الفهري',
  nameTransliterated: 'Suhail ibn Bayda al-Fihri',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'سهيل بن بيضاء وهب بن ربيعة بن هلال بن مالك بن ضبة بن الحارث بن فهر القرشي الفهري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'wahb-ibn-rabiah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default suhailIbnBayda;
