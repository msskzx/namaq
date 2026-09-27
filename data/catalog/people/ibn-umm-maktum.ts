import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Naming disagreement per the retired prisma/personSeedData7.ts entry:
 * Medinans say "Abdullah ibn Qais ibn Zaidah"; Iraqis say "Amr". The more
 * commonly cited Medinan attribution is used here.
 */
const ibnUmmMaktum = {
  kind: 'PERSON',
  slug: 'ibn-umm-maktum',
  name: 'ابن أم مكتوم',
  nameTransliterated: 'Ibn Umm Maktum',
  hasProfile: true,
  fields: {
    fullName: { value: 'عبد الله بن قيس بن زائدة بن الأصم بن رواحة القرشي العامري', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'qais-ibn-zaidah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ibnUmmMaktum;
