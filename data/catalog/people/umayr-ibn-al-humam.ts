import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * One of the fourteen the sira names as the dead of Badr. He had no subject in
 * the app until this batch reached the roster, so the catalog creates him:
 * nothing under prisma/ declares him, which makes this module his only author.
 */
// بخ بخ, then he threw away the dates he was eating rather than wait out the
// life it would take to finish them.
const umayrIbnAlHumam = {
  kind: 'PERSON',
  slug: 'umayr-ibn-al-humam',
  name: 'عمير بن الحمام',
  nameTransliterated: 'Umayr ibn al-Humam',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['umayr-humam/sex'] },
    virtues: {
      value:
        'قال حين سمع: (قوموا إلى جنة عرضها السموات والأرض) : بخ بخ! ثم ألقى تمرات كانت معه وقاتل حتى قتل.',
      claims: ['umayr-humam/badr'],
    },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default umayrIbnAlHumam;
