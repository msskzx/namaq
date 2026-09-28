import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abdShamsIbnAbdWud = {
  kind: 'PERSON',
  slug: 'abd-shams-ibn-abd-wud',
  name: 'عبد شمس بن عبد ود',
  nameTransliterated: 'Abd Shams ibn Abd Wud',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abd-wud-ibn-nasr', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdShamsIbnAbdWud;
