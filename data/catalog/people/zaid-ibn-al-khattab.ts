import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Full brother of Umar ibn al-Khattab (same father and grandfather) per the
 * retired prisma/personSeedData6.ts entry.
 */
const zaidIbnAlKhattab = {
  kind: 'PERSON',
  slug: 'zaid-ibn-al-khattab',
  name: 'زيد بن الخطاب',
  nameTransliterated: 'Zaid ibn al-Khattab',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'زيد بن الخطاب بن نفيل بن عبد العزى بن رياح بن قرط بن رزاح بن عدي بن كعب بن لؤي القرشي العدوي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-khattab-ibn-nufayl', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default zaidIbnAlKhattab;
