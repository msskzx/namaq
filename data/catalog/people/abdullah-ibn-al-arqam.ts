import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abdullahIbnAlArqam = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-al-arqam',
  name: 'عبد الله بن الأرقم',
  nameTransliterated: 'Abdullah ibn al-Arqam',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عبد الله بن الأرقم بن عبد يغوث بن وهب بن عبد مناف بن زهرة القرشي الزهري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abd-yaghuth-ibn-wahb', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdullahIbnAlArqam;
