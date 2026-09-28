import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. fullName and the companion title
 * are carried from the retired prisma/personSeedData13.ts entry. Son
 * Abdullah and nephew Humayd, narrators from him, are not yet in this
 * pipeline.
 */
const safwanIbnUmayyah = {
  kind: 'PERSON',
  slug: 'safwan-ibn-umayyah',
  name: 'صفوان بن أمية',
  nameTransliterated: 'Safwan ibn Umayyah',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'صفوان بن أمية بن خلف بن وهب بن حذافة بن جمح بن عمرو بن هصيص بن كعب بن لؤي بن غالب القرشي الجمحي المكي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'umayyah-ibn-khalaf', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default safwanIbnUmayyah;
