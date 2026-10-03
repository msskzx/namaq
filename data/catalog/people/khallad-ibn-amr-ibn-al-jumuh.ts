import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const khalladIbnAmrIbnAlJumuh = {
  kind: 'PERSON',
  slug: 'khallad-ibn-amr-ibn-al-jumuh',
  name: 'خَلاَّدُ بنُ عَمْرِو',
  nameTransliterated: 'Khallad ibn Amr ibn al-Jumuh',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'خَلاَّدُ بنُ عَمْرِو بنِ الجَمُوْحِ الأَنْصَارِيُّ',
      claims: ['khallad-siyar4/fullName'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'amr-ibn-al-jumuh', claims: ['khallad-siyar4/father'] },
  ],
} satisfies CatalogPerson;

export default khalladIbnAmrIbnAlJumuh;
