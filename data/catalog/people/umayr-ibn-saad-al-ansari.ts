import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const umayrIbnSaadAlAnsari = {
  kind: 'PERSON',
  slug: 'umayr-ibn-saad-al-ansari',
  name: 'عمير بن سعد الأنصاري',
  nameTransliterated: 'Umayr ibn Saad al-Ansari',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'saad-ibn-shahid-al-awsi', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default umayrIbnSaadAlAnsari;
