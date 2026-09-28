import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Explicitly confirmed on her own page, per the retired
 * prisma/personSeedData10.ts entry, as sister of the companion Maymunah
 * bint al-Harith (shared father) and mother of Abdullah ibn Abbas (not yet
 * in this pipeline); her husband al-Abbas ibn Abd al-Muttalib already
 * declares the marriage from his own side.
 */
const ummAlFadlBintAlHarith = {
  kind: 'PERSON',
  slug: 'umm-al-fadl-bint-al-harith',
  name: 'أم الفضل',
  nameTransliterated: 'Umm al-Fadl bint al-Harith',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: { value: 'لبابة بنت الحارث بن حزن بن بجير الهلالية', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'al-harith-ibn-hazn-al-hilali', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ummAlFadlBintAlHarith;
