import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const alHakamIbnAmrAlGhifari = {
  kind: 'PERSON',
  slug: 'al-hakam-ibn-amr-al-ghifari',
  name: 'الحكم بن عمرو الغفاري',
  nameTransliterated: 'Al-Hakam ibn Amr al-Ghifari',
  hasProfile: true,
  fields: {
    fullName: { value: 'الحكم بن عمرو الغفاري', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'BROTHER', inverse: 'BROTHER', to: 'rafi-ibn-amr-al-ghifari', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alHakamIbnAmrAlGhifari;
