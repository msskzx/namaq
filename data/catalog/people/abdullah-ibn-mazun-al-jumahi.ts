import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/abdullah-ibn-mazun-al-jumahi, entry 11,
// the sibling entry immediately after qudamah-ibn-mazun. A Badr, Uhud and
// Khandaq veteran, twice a migrant to Abyssinia, and the third of the three
// Maz'un brothers.
const abdullahIbnMazun = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-mazun-al-jumahi',
  name: 'عبد الله بن مظعون الجمحي',
  nameTransliterated: 'Abdullah ibn Mazun al-Jumahi',
  hasProfile: true,
  fields: {
    kunya: { value: 'أَبُو مُحَمَّدٍ', claims: ['abdullah-mazun-siyar11/kunya'] },
    deathYearHijri: { value: '30', claims: ['abdullah-mazun-siyar11/death-year'] },
  },
  titles: [
    // Carried from the seed. This entry calls him a Sabiq, not صحابي in
    // those words, so it stays legacy, matching his brothers' entries.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    // The seed's graph already carries this SON edge with no citation; this
    // entry never states his father's name either. Uthman's own entry
    // already declares the BROTHER edges to him, so none are repeated here.
    { type: 'SON', inverse: 'FATHER', to: 'mazun-ibn-habib', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdullahIbnMazun;
