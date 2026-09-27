import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const usamahIbnZaid = {
  kind: 'PERSON',
  slug: 'usamah-ibn-zaid',
  name: 'أسامة بن زيد',
  nameTransliterated: 'Usamah ibn Zaid',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'أسامة بن زيد بن حارثة بن شراحيل بن عبد العزى بن امرئ القيس',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'zaid-ibn-harithah', claims: legacyUnreviewed },
    { type: 'SON', inverse: 'MOTHER', to: 'umm-ayman', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default usamahIbnZaid;
