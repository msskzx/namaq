import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData9.ts entry. Renamed from
 * "fatimah-al-zahra"/"فاطمة الزهراء" for consistency with her sisters'
 * slug/name convention (zaynab-bint-muhammad, ruqayyah-bint-muhammad,
 * umm-kulthum-bint-muhammad). Her FATHER edge (prophet-muhammad.ts) and
 * HUSBAND edge (ali-ibn-abi-talib.ts) are already declared from the other
 * side. appearance, virtues, the daughter-of-prophet title and the ayat
 * below are carried from the retired prisma/personSeedData.ts entry,
 * uncited.
 */
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
      claims: legacyUnreviewed,
    },
    appearance: {
      value: 'كانت تشبه النبي صلى الله عليه وسلم في مشيتها وكلامها.',
      claims: legacyUnreviewed,
    },
    virtues: {
      value: 'بضعة من رسول الله، سيدة نساء أهل الجنة، زوجة علي بن أبي طالب، أم الحسنين.',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
    { title: 'sayyidat-nisa-ahl-al-jannah', name: 'سيدة نساء أهل الجنة', nameTransliterated: 'Mistress of the Women of Paradise', claims: legacyUnreviewed },
    { title: 'daughter-of-prophet', name: 'بنت النبي', nameTransliterated: 'Daughter of the Prophet', claims: legacyUnreviewed },
  ],
  ayat: [
    { surah: 76, ayah: 8, claims: legacyUnreviewed },
    { surah: 33, ayah: 33, claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default fatimahBintMuhammad;
