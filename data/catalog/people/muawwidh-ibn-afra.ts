import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * One of the fourteen the sira names as the dead of Badr. He had no subject in
 * the app until this batch reached the roster, so the catalog creates him:
 * nothing under prisma/ declares him, which makes this module his only author.
 *
 * Merged 2026-11-18 with the old `muawwidh-ibn-al-harith` node, which was the
 * same man: Afra is his mother and al-Harith ibn Rifa'ah his father. The sira
 * names him by his mother (cited below) and the nasab by his father, which is
 * the fullName carried from that node, still on the legacy marker.
 */
// The other son of Afra. He struck Abu Jahl down and fought on until he was
// killed; the Prophet called the two of them partners in that killing.
const muawwidhIbnAfra = {
  kind: 'PERSON',
  slug: 'muawwidh-ibn-afra',
  name: 'معوذ بن عفراء',
  nameTransliterated: 'Muawwidh ibn Afra',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['muawwidh-afra/sex'] },
    fullName: {
      value: 'معوذ بن الحارث بن رفاعة بن الحارث بن سواد بن مالك بن غنم بن مالك بن النجار الأنصاري النجاري',
      claims: legacyUnreviewed,
    },
  },
  virtues: [
    {
      value:
        'قال صلى الله عليه وسلم: (يرحم الله ابني عفراء، فهما شركاء في قتل فرعون هذه الأمة ورأس أئمة الكفر) .',
      claims: ['muawwidh-afra/badr'],
    },
  ],

  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-harith-ibn-rifaah-al-najjari', claims: legacyUnreviewed },
    { type: 'SON', inverse: 'MOTHER', to: 'afra-bint-ubayd', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default muawwidhIbnAfra;
