import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. fullName and the companion title
 * are carried from the retired prisma/personSeedData14.ts entry.
 */
const qaisIbnSaad = {
  kind: 'PERSON',
  slug: 'qais-ibn-saad',
  name: 'قيس بن سعد',
  nameTransliterated: 'Qais ibn Saad',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'قيس بن سعد بن عبادة بن دليم بن حارثة بن أبي حزيمة بن ثعلبة بن طريف بن الخزرج بن ساعدة بن كعب بن الخزرج الأنصاري الخزرجي الساعدي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'saad-ibn-ubadah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default qaisIbnSaad;
