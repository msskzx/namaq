import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const asmaBintYazidIbnAlSakn = {
  kind: 'PERSON',
  slug: 'asma-bint-yazid-ibn-al-sakn',
  name: 'أسماء بنت يزيد بن السكن',
  nameTransliterated: 'Asma bint Yazid ibn al-Sakn',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'PATERNAL_COUSIN', inverse: 'PATERNAL_COUSIN', to: 'muadh-ibn-jabal', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default asmaBintYazidIbnAlSakn;
