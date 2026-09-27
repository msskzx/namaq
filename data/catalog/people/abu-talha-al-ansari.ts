import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abuTalhaAlAnsari = {
  kind: 'PERSON',
  slug: 'abu-talha-al-ansari',
  name: 'أبو طلحة الأنصاري',
  nameTransliterated: 'Abu Talha al-Ansari',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'sahl-ibn-al-aswad', claims: legacyUnreviewed },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'umm-sulaym-al-ghumaysa', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abuTalhaAlAnsari;
