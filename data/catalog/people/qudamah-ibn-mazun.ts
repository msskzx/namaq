import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/qudamah-ibn-mazun, entry 10, the sibling
// entry immediately after uthman-ibn-mazun. A Badr and Uhud veteran, twice a
// migrant to Abyssinia, and Umar's governor of Bahrain until the wine
// incident there.
const qudamahIbnMazun = {
  kind: 'PERSON',
  slug: 'qudamah-ibn-mazun',
  name: 'قدامة بن مظعون',
  nameTransliterated: 'Qudamah ibn Mazun',
  hasProfile: true,
  fields: {
    kunya: { value: 'أَبُو عَمْرٍو', claims: ['qudamah-mazun-siyar10/kunya'] },
    appearance: {
      value: 'كَانَ طَوِيْلاً أَسْمَرَ.',
      claims: ['qudamah-mazun-siyar10/appearance'],
    },
    deathYearHijri: { value: '36', claims: ['qudamah-mazun-siyar10/death-year'] },
  },
  titles: [
    // Carried from the seed. This entry calls him a Badr veteran and an
    // early Muslim, not صحابي in those words, so it stays legacy.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    // The seed's graph already carries this SON edge with no citation; this
    // entry's own heading never states his father's name.
    { type: 'SON', inverse: 'FATHER', to: 'mazun-ibn-habib', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default qudamahIbnMazun;
