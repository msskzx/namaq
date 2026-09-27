import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abuSufyanIbnAlHarith = {
  kind: 'PERSON',
  slug: 'abu-sufyan-ibn-al-harith',
  name: 'أبو سفيان بن الحارث',
  nameTransliterated: 'Abu Sufyan ibn al-Harith',
  hasProfile: true,
  fields: {
    // Carried from the retired prisma/personSeedData5.ts entry. "Abu Sufyan"
    // is his kunya; the fullName gives his given name, al-Mughirah.
    fullName: { value: 'المغيرة بن الحارث بن عبد المطلب بن هاشم القرشي الهاشمي', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-harith-ibn-abd-al-muttalib', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abuSufyanIbnAlHarith;
