import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Famous for fighting to defend the Prophet at Uhud (sustaining thirteen
 * wounds) after first providing water/supplies, and for losing a hand at
 * Yamamah, per the retired prisma/personSeedData10.ts entry. Her nasab as
 * given on her own page stops at "ibn Mabdhul" and does not explicitly
 * continue to the existing Najjar-branch ancestor nodes used elsewhere in
 * this pipeline -- kept as a standalone chain rather than assuming that
 * connection. Her sons and brother are not yet in this pipeline.
 */
const ummUmarah = {
  kind: 'PERSON',
  slug: 'umm-umarah',
  name: 'أم عمارة',
  nameTransliterated: 'Umm Umarah (Nusaybah bint Kaab)',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: {
      value: 'نسيبة بنت كعب بن عمرو بن عوف بن مبذول الأنصارية الخزرجية النجارية المازنية',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'kaab-ibn-amr-ibn-awf', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ummUmarah;
