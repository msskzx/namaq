import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const jabrIbnAtik = {
  kind: 'PERSON',
  slug: 'jabr-ibn-atik',
  name: 'جبر بن عتيك',
  nameTransliterated: 'Jabr ibn Atik',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'جبر بن عتيك بن قيس بن هيشة بن الحارث بن أمية بن معاوية بن مالك بن عوف بن عمرو بن عوف الأنصاري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'atik-ibn-qais-al-ansari', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default jabrIbnAtik;
