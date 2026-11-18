import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * One of the fourteen the sira names as the dead of Badr. He had no subject in
 * the app until this batch reached the roster, so the catalog creates him:
 * nothing under prisma/ declares him, which makes this module his only author.
 *
 * Merged 2026-11-18 with the old `awf-ibn-al-harith` node, which was the
 * same man: Afra is his mother and al-Harith ibn Rifa'ah his father. The sira
 * names him by his mother (cited below) and the nasab by his father, which is
 * the fullName carried from that node, still on the legacy marker.
 */
// One of the two sons of Afra. He fell before his brother.
const awfIbnAfra = {
  kind: 'PERSON',
  slug: 'awf-ibn-afra',
  name: 'عوف بن عفراء',
  nameTransliterated: 'Awf ibn Afra',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['awf-afra/sex'] },
    fullName: {
      value: 'عوف بن الحارث بن رفاعة بن الحارث بن سواد بن مالك بن غنم بن مالك بن النجار الأنصاري النجاري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-harith-ibn-rifaah-al-najjari', claims: legacyUnreviewed },
    { type: 'SON', inverse: 'MOTHER', to: 'afra-bint-ubayd', claims: legacyUnreviewed },
    { type: 'BROTHER', inverse: 'BROTHER', to: 'muadh-ibn-al-harith', claims: legacyUnreviewed },
    { type: 'BROTHER', inverse: 'BROTHER', to: 'muawwidh-ibn-afra', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default awfIbnAfra;
