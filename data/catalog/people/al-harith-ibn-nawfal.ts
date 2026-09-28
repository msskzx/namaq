import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const alHarithIbnNawfal = {
  kind: 'PERSON',
  slug: 'al-harith-ibn-nawfal',
  name: 'الحارث بن نوفل',
  nameTransliterated: 'Al-Harith ibn Nawfal',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'الحارث بن نوفل بن الحارث الهاشمي',
      claims: ['al-harith-ibn-nawfal-siyar28/full-name'],
    },
    virtues: {
      value:
        'أسلم مع أبيه، واستعمله النبي صلى الله عليه وسلم على بعض العمل، وولي مكة لعمر وعثمان.',
      claims: ['al-harith-ibn-nawfal-siyar28/virtues'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'nawfal-ibn-al-harith',
      claims: ['al-harith-ibn-nawfal-siyar28/father'],
    },
  ],
} satisfies CatalogPerson;

export default alHarithIbnNawfal;
