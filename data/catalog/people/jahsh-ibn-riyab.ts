import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const jahshIbnRiyab = {
  kind: 'PERSON',
  slug: 'jahsh-ibn-riyab',
  name: 'جحش بن رئاب',
  nameTransliterated: 'Jahsh ibn Riyab',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'HUSBAND', inverse: 'WIFE', to: 'umaymah-bint-abd-al-muttalib', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default jahshIbnRiyab;
