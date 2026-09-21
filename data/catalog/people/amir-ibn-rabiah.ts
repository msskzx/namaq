import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// The seed entry is retired, so this module is the author; what it held and
// no batch cites is carried below with its evidence owed. His حلف is with a
// household rather than a clan, آل الخطاب, and the value keeps the source's
// wording.
const amirIbnRabiah = {
  kind: 'PERSON',
  slug: 'amir-ibn-rabiah',
  name: 'عامر بن ربيعة',
  nameTransliterated: 'Amir ibn Rabiah',
  hasProfile: true,
  fields: {
    // Carried from the retired seed entry, which took it from the Siyar
    // without citing it.
    fullName: { value: 'عامر بن ربيعة بن كعب العنزي', claims: legacyUnreviewed },
    tribalAffiliation: { value: 'حليف آل الخطاب', claims: ['amir-ibn-rabiah/hilf'] },
  },
  titles: [
    // Carried from the retired seed entry. The seeds gave every صحابي this
    // title without citing it.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default amirIbnRabiah;
