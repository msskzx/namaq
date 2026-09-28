import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abdAlUzzaIbnAbdShams = {
  kind: 'PERSON',
  slug: 'abd-al-uzza-ibn-abd-shams',
  name: 'عبد العزى بن عبد شمس',
  nameTransliterated: 'Abd Al Uzza ibn Abd Shams',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abd-shams-ibn-abd-manaf', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdAlUzzaIbnAbdShams;
