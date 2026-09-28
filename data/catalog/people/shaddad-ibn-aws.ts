import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Explicitly "ibn akhi Hassan ibn Thabit" (nephew of Hassan ibn Thabit) on
 * his own page, per the retired prisma/personSeedData12.ts entry: his chain
 * and Hassan's overlap exactly from Thabit ibn al-Mundhir ibn Haram onward.
 */
const shaddadIbnAws = {
  kind: 'PERSON',
  slug: 'shaddad-ibn-aws',
  name: 'شداد بن أوس',
  nameTransliterated: 'Shaddad ibn Aws',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'شداد بن أوس بن ثابت بن المنذر بن حرام الأنصاري النجاري الخزرجي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'aws-ibn-thabit', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default shaddadIbnAws;
