import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Mother of Anas ibn Malik (not yet in this pipeline), per the retired
 * prisma/personSeedData10.ts entry. Her first husband Malik ibn al-Najjar
 * is the same node created as al-Baraa ibn Malik's father; her second
 * husband, Abu Talha al-Ansari, already declares the marriage from his own
 * side.
 */
const ummSulaymAlGhumaysa = {
  kind: 'PERSON',
  slug: 'umm-sulaym-al-ghumaysa',
  name: 'أم سليم الغميصاء',
  nameTransliterated: 'Umm Sulaym al-Ghumaysa',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'الغميصاء بنت ملحان بن خالد بن زيد بن حرام بن جندب بن عامر بن غنم بن عدي بن النجار الأنصارية الخزرجية',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'milhan-ibn-khalid-al-najjari', claims: legacyUnreviewed },
    { type: 'WIFE', inverse: 'HUSBAND', to: 'malik-ibn-al-najjar', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ummSulaymAlGhumaysa;
