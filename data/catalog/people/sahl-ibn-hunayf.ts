import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. The Prophet paired him in
 * brotherhood with Ali per the retired prisma/personSeedData11.ts entry --
 * not modelled, since this graph has no such relation type, only
 * blood/marriage ties.
 */
const sahlIbnHunayf = {
  kind: 'PERSON',
  slug: 'sahl-ibn-hunayf',
  name: 'سهل بن حنيف',
  nameTransliterated: 'Sahl ibn Hunayf',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'سهل بن حنيف بن واهب بن عكيم بن ثعلبة بن عمرو بن الحارث بن مجدعة بن عمرو بن حنش بن عوف بن عمرو بن عوف الأنصاري الأوسي العوفي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'BROTHER', inverse: 'BROTHER', to: 'uthman-ibn-hunayf', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default sahlIbnHunayf;
