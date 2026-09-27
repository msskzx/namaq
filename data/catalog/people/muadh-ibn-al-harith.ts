import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Brother of Muawwidh and Awf ibn al-Harith below -- all three sons of Afra
 * bint Ubayd, the "ibna Afra'" of the Abu Jahl-killing tradition, per the
 * retired prisma/personSeedData11.ts entry. Fuller nasab per Ibn Sa'd, as
 * quoted on his own page.
 */
const muadhIbnAlHarith = {
  kind: 'PERSON',
  slug: 'muadh-ibn-al-harith',
  name: 'معاذ بن الحارث',
  nameTransliterated: 'Muadh ibn al-Harith',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'معاذ بن الحارث بن رفاعة بن الحارث بن سواد بن مالك بن غنم بن مالك بن النجار الأنصاري النجاري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-harith-ibn-rifaah-al-najjari', claims: legacyUnreviewed },
    { type: 'SON', inverse: 'MOTHER', to: 'afra-bint-ubayd', claims: legacyUnreviewed },
    { type: 'BROTHER', inverse: 'BROTHER', to: 'muawwidh-ibn-al-harith', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default muadhIbnAlHarith;
