import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const shaddadIbnAws = {
  kind: 'PERSON',
  slug: 'shaddad-ibn-aws',
  name: 'شداد بن أوس',
  nameTransliterated: 'Shaddad ibn Aws',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'aws-ibn-thabit', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default shaddadIbnAws;
