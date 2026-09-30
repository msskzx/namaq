import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const fatimahBintMuhammad = {
  kind: 'PERSON',
  slug: 'fatimah-bint-muhammad',
  name: 'فاطمة بنت محمد',
  nameTransliterated: 'Fatimah bint Muhammad',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: {
      value: 'فاطمة بنت محمد بن عبد الله بن عبد المطلب بن هاشم القرشية الهاشمية',
      claims: ['fatimah-siyar/full-name'],
    },
    appearance: {
      value: 'كانت تشبه النبي صلى الله عليه وسلم في مشيتها وكلامها.',
      claims: ['fatimah-siyar/appearance'],
    },
    virtues: {
      value: 'بضعة من رسول الله، سيدة نساء أهل الجنة، زوجة علي بن أبي طالب، أم الحسنين.',
      claims: ['fatimah-siyar/virtues'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
    { title: 'sayyidat-nisa-ahl-al-jannah', name: 'سيدة نساء أهل الجنة', nameTransliterated: 'Mistress of the Women of Paradise', claims: ['fatimah-siyar/title-sayyidat-nisa'] },
    { title: 'daughter-of-prophet', name: 'بنت النبي', nameTransliterated: 'Daughter of the Prophet', claims: ['fatimah-siyar/title-daughter-of-prophet'] },
  ],
  ayat: [
    { surah: 76, ayah: 8, claims: legacyUnreviewed },
    { surah: 33, ayah: 33, claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'prophet-muhammad', claims: ['fatimah-siyar/daughter-prophet'] },
    { type: 'WIFE', inverse: 'HUSBAND', to: 'ali-ibn-abi-talib', claims: ['fatimah-siyar/wife-ali'] },
  ],
} satisfies CatalogPerson;

export default fatimahBintMuhammad;
