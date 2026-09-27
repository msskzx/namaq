import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abdAwfIbnAbd = {
  kind: 'PERSON',
  slug: 'abd-awf-ibn-abd',
  name: 'عبد عوف بن عبد',
  nameTransliterated: 'Abd Awf Ibn Abd',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abd-ibn-al-harith-ibn-zuhrah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdAwfIbnAbd;
