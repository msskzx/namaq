import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * His own page gives only the short "ibn Rifaah, ibn Afraa" form per the
 * retired prisma/personSeedData11.ts entry; fullName is filled in via the
 * sibling-grouping inference rule from Muadh ibn al-Harith's fuller chain.
 * Martyred at Badr.
 */
const awfIbnAlHarith = {
  kind: 'PERSON',
  slug: 'awf-ibn-al-harith',
  name: 'عوف بن الحارث',
  nameTransliterated: 'Awf ibn al-Harith',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عوف بن الحارث بن رفاعة بن الحارث بن سواد بن مالك بن غنم بن مالك بن النجار الأنصاري النجاري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-harith-ibn-rifaah-al-najjari', claims: legacyUnreviewed },
    { type: 'SON', inverse: 'MOTHER', to: 'afra-bint-ubayd', claims: legacyUnreviewed },
    { type: 'BROTHER', inverse: 'BROTHER', to: 'muadh-ibn-al-harith', claims: legacyUnreviewed },
    { type: 'BROTHER', inverse: 'BROTHER', to: 'muawwidh-ibn-al-harith', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default awfIbnAlHarith;
