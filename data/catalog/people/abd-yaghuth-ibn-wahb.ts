import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abdYaghuthIbnWahb = {
  kind: 'PERSON',
  slug: 'abd-yaghuth-ibn-wahb',
  name: 'عبد يغوث بن وهب',
  nameTransliterated: 'Abd Yaghuth ibn Wahb',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'wahb-ibn-abd-manaf-al-zuhri', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdYaghuthIbnWahb;
