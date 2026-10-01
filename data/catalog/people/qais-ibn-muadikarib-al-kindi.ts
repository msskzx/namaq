import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const qaisIbnMuadikaribAlKindi = {
  kind: 'PERSON',
  slug: 'qais-ibn-muadikarib-al-kindi',
  name: 'قيس بن معدي كرب',
  nameTransliterated: 'Qais ibn Muadikarib Al Kindi',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    {
      type: 'FATHER',
      inverse: 'SON',
      to: 'al-ashath-ibn-qais',
      claims: ['al-ashath-ibn-qais-siyar8/father'],
    },
    { type: 'FATHER', inverse: 'DAUGHTER', to: 'qutaylah-bint-qais-al-kindiyyah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default qaisIbnMuadikaribAlKindi;
