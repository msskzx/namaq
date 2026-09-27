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
 * One of the two brothers credited with wounding Abu Jahl at Badr before
 * Ibn Masud delivered the final blow.
 */
const muawwidhIbnAlHarith = {
  kind: 'PERSON',
  slug: 'muawwidh-ibn-al-harith',
  name: 'معوذ بن الحارث',
  nameTransliterated: 'Muawwidh ibn al-Harith',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'معوذ بن الحارث بن رفاعة بن الحارث بن سواد بن مالك بن غنم بن مالك بن النجار الأنصاري النجاري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-harith-ibn-rifaah-al-najjari', claims: legacyUnreviewed },
    { type: 'SON', inverse: 'MOTHER', to: 'afra-bint-ubayd', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default muawwidhIbnAlHarith;
