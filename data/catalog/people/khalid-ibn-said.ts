import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const khalidIbnSaid = {
  kind: 'PERSON',
  slug: 'khalid-ibn-said',
  name: 'خالد بن سعيد',
  nameTransliterated: 'Khalid ibn Said',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'خالد بن سعيد بن العاص بن أمية بن عبد شمس بن عبد مناف بن قصي القرشي الأموي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'said-ibn-al-as', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default khalidIbnSaid;
