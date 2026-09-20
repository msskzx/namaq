import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * Named among the dead of Uhud, with no subject in the app until this batch
 * reached him. Nothing under prisma/ declares him, so this module is his only
 * author and catalog:project creates the row.
 */
// غسيل الملائكة. He went out in a state of janabah when he heard the alarm,
// which is what the Prophet gave as the reason the angels washed him.
const hanzalahIbnAbiAmir = {
  kind: 'PERSON',
  slug: 'hanzalah-ibn-abi-amir',
  name: 'حنظلة بن أبي عامر',
  nameTransliterated: 'Hanzalah ibn Abi Amir',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['hanzalah/sex'] },
    virtues: {
      value:
        'خرج جنبا حين سمع الهيعة فقتل يوم أحد، فقال صلى الله عليه وسلم: (إن صاحبكم لتغسله الملائكة) ، وهو غسيل الملائكة.',
      claims: ['hanzalah/uhud'],
    },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default hanzalahIbnAbiAmir;
