import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const alAshathIbnQais = {
  kind: 'PERSON',
  slug: 'al-ashath-ibn-qais',
  name: 'الأشعث بن قيس',
  nameTransliterated: 'Al-Ashath ibn Qais',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'qais-ibn-muadikarib-al-kindi', claims: legacyUnreviewed },
    { type: 'BROTHER', inverse: 'SISTER', to: 'qutaylah-bint-qais-al-kindiyyah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alAshathIbnQais;
