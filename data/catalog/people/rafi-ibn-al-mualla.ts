import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * One of the fourteen the sira names as the dead of Badr. He had no subject in
 * the app until this batch reached the roster, so the catalog creates him:
 * nothing under prisma/ declares him, which makes this module his only author.
 */
// Of Banu Zurayq, by the roster.
const rafiIbnAlMualla = {
  kind: 'PERSON',
  slug: 'rafi-ibn-al-mualla',
  name: 'رافع بن المعلى',
  nameTransliterated: 'Rafi ibn al-Mualla',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['rafi-mualla/sex'] },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default rafiIbnAlMualla;
