import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const aishaBintAbiBakr = {
  kind: 'PERSON',
  slug: 'aisha-bint-abi-bakr',
  name: 'عائشة بنت أبي بكر',
  nameTransliterated: 'Aisha bint Abi Bakr',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عائشة بنت أبي بكر عبد الله بن أبي قحافة عثمان بن عامر بن عمرو بن كعب بن سعد بن تيم بن مرة بن كعب بن لؤي القرشية التيمية',
      claims: ['aisha-siyar/full-name'],
    },
    appearance: { value: 'كانت امرأة بيضاء جميلة، ولذلك كانت تسمى الحميراء.', claims: ['aisha-siyar/appearance'] },
    virtues: {
      value: 'كانت أفقه نساء الأمة، ولم يعلم الذهبي في النساء امرأة أعلم منها.',
      claims: ['aisha-siyar/virtues'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
    { title: 'siddiqa', name: 'صديقة', nameTransliterated: 'Siddiqa', claims: ['aisha-siyar/title-siddiqa'] },
    {
      title: 'mother-of-believers',
      name: 'أم المؤمنين',
      nameTransliterated: 'Mother of the Believers',
      claims: ['aisha-siyar/title-mother-of-believers'],
    },
  ],
  ayat: [
    { surah: 24, ayah: 11, claims: ['aisha-siyar/ayah-an-nur-eleven'] },
    { surah: 33, ayah: 33, claims: ['aisha-siyar/ayah-al-ahzab-thirty-three'] },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'abu-bakr-as-siddiq', claims: ['aisha-siyar/father'] },
    { type: 'SISTER', inverse: 'BROTHER', to: 'abd-al-rahman-ibn-abi-bakr', claims: ['aisha-siyar/brother-abd-al-rahman'] },
    { type: 'WIFE', inverse: 'HUSBAND', to: 'prophet-muhammad', claims: ['aisha-siyar/wife-prophet'] },
  ],
} satisfies CatalogPerson;

export default aishaBintAbiBakr;
