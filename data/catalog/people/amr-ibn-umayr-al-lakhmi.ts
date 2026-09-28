import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const amrIbnUmayrAlLakhmi = {
  kind: 'PERSON',
  slug: 'amr-ibn-umayr-al-lakhmi',
  name: 'عمرو بن عمير',
  nameTransliterated: 'Amr ibn Umayr Al Lakhmi',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'umayr-ibn-salamah-al-lakhmi', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default amrIbnUmayrAlLakhmi;
