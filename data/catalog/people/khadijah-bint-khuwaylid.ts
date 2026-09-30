import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const khadijahBintKhuwaylid = {
  kind: 'PERSON',
  slug: 'khadijah-bint-khuwaylid',
  name: 'خديجة بنت خويلد',
  nameTransliterated: 'Khadijah bint Khuwaylid',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'خديجة بنت خويلد بن أسد بن عبد العزى بن قصي بن كلاب القرشية الأسدية',
      claims: ['khadijah-siyar/full-name'],
    },
    kunya: { value: 'أم القاسم', claims: ['khadijah-siyar/kunya'] },
    sex: { value: 'FEMALE', claims: ['khadijah/sex'] },
    virtues: {
      value:
        'قال صلى الله عليه وسلم: (والله لقد آمنت بي إذ كفر بي الناس، وآوتني إذ رفضني الناس، وصدقتني إذ كذبني الناس، ورزقت منها الولد) .',
      claims: ['khadijah/virtues'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
    {
      title: 'mother-of-believers',
      name: 'أم المؤمنين',
      nameTransliterated: 'Mother of the Believers',
      claims: ['khadijah-siyar/title-mother-of-believers'],
    },
    {
      title: 'first-wife',
      name: 'أول زوجات النبي',
      nameTransliterated: 'First Wife of the Prophet',
      claims: ['khadijah-siyar/title-first-wife'],
    },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'khuwaylid-ibn-asad', claims: ['khadijah-siyar/father'] },
    { type: 'SISTER', inverse: 'BROTHER', to: 'hizam-ibn-khuwaylid', claims: legacyUnreviewed },
    { type: 'WIFE', inverse: 'HUSBAND', to: 'prophet-muhammad', claims: ['khadijah-siyar/wife-prophet'] },
  ],
} satisfies CatalogPerson;

export default khadijahBintKhuwaylid;
