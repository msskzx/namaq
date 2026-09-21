import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// The seed entry is retired, so this module is the author; what it held and
// no batch cites is carried below with its evidence owed. The roster of the
// first believers is where this chapter places him, and by his حلف rather
// than by a nasab.
const khabbabIbnAlAratt = {
  kind: 'PERSON',
  slug: 'khabbab-ibn-al-aratt',
  name: 'خباب بن الأرت',
  nameTransliterated: 'Khabbab ibn al-Aratt',
  hasProfile: true,
  fields: {
    // Carried from the retired seed entry, which took it from the Siyar
    // without citing it.
    fullName: {
      value: 'خباب بن الأرت بن جندلة بن سعد بن خزيمة بن كعب بن سعد بن زيد مناة التميمي',
      claims: legacyUnreviewed,
    },
    tribalAffiliation: { value: 'حليف بني زهرة', claims: ['khabbab/hilf'] },
  },
  titles: [
    // Carried from the retired seed entry. The seeds gave every صحابي this
    // title without citing it.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default khabbabIbnAlAratt;
