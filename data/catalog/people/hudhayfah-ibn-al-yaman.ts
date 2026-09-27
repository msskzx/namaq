import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Father Hisl (also read Husayl) ibn Jabir, called "al-Yaman", was martyred
 * at Uhud, killed by his own side by mistake, for which Hudhayfah forgave
 * the blood money -- per the retired prisma/personSeedData11.ts entry.
 */
const hudhayfahIbnAlYaman = {
  kind: 'PERSON',
  slug: 'hudhayfah-ibn-al-yaman',
  name: 'حذيفة بن اليمان',
  nameTransliterated: 'Hudhayfah ibn al-Yaman',
  hasProfile: true,
  fields: {
    fullName: { value: 'حذيفة بن حسل بن جابر العبسي اليماني', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'hisl-ibn-jabir-al-absi', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default hudhayfahIbnAlYaman;
