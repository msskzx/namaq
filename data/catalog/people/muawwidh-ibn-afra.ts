import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * One of the fourteen the sira names as the dead of Badr. He had no subject in
 * the app until this batch reached the roster, so the catalog creates him:
 * nothing under prisma/ declares him, which makes this module his only author.
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
    virtues: {
      value:
        'قال صلى الله عليه وسلم: (يرحم الله ابني عفراء، فهما شركاء في قتل فرعون هذه الأمة ورأس أئمة الكفر) .',
      claims: ['muawwidh-afra/badr'],
    },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default muawwidhIbnAfra;
