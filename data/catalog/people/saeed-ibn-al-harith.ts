import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Marginal companion status: the retired prisma/personSeedData5.ts entry
 * noted that al-Hakim alone counted him among the Companions, on a single
 * contested transmitted hadith. Worth a second look once a batch reaches him.
 */
const saeedIbnAlHarith = {
  kind: 'PERSON',
  slug: 'saeed-ibn-al-harith',
  name: 'سعيد بن الحارث',
  nameTransliterated: 'Saeed ibn al-Harith',
  hasProfile: true,
  fields: {
    fullName: { value: 'سعيد بن الحارث بن عبد المطلب بن هاشم القرشي الهاشمي', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-harith-ibn-abd-al-muttalib', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default saeedIbnAlHarith;
