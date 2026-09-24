import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/as-saib-ibn-uthman, entry 12, the
// entry immediately after his uncle abdullah-ibn-mazun-al-jumahi. Uthman
// ibn Maz'un's son, a noted archer, present at Badr, and wounded at Yamama.
const asSaibIbnUthman = {
  kind: 'PERSON',
  slug: 'as-saib-ibn-uthman',
  name: 'السائب بن عثمان',
  nameTransliterated: 'As-Saib ibn Uthman',
  hasProfile: true,
  fields: {
    virtues: { value: 'وَكَانَ مِنَ الرُّمَاةِ المَذْكُوْرِيْنَ', claims: ['saib-uthman-siyar12/virtues'] },
    deathYearHijri: { value: '12', claims: ['saib-uthman-siyar12/death-year'] },
  },
  titles: [
    // Carried from the seed. This entry never calls him صحابي outright.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  // The FATHER edge back to him is declared on uthman-ibn-mazun's own
  // catalog file, now cited from this entry's own opening nasab. The Badr
  // participation is declared on badr.ts's own participants list.
  relations: [],
} satisfies CatalogPerson;

export default asSaibIbnUthman;
