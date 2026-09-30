import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * See data/history/batches/asma-bint-al-numan-al-kindiyyah/summary.md — the
 * Siyar entry titled "الكندية" reads as this subject and now backs her nasab,
 * appearance and second marriage. `sex` and the companion title stay on the
 * legacy marker per Siyar-batch convention (see that batch's summary).
 */
const asmaBintAlNumanAlKindiyyah = {
  kind: 'PERSON',
  slug: 'asma-bint-al-numan-al-kindiyyah',
  name: 'أسماء بنت النعمان',
  nameTransliterated: 'Asma bint al-Numan al-Kindiyyah',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: {
      value: 'أسماء بنت النعمان بن أبي الجون الكندي',
      claims: ['asma-bint-al-numan-al-kindiyyah-siyar/father'],
    },
    appearance: {
      value: 'وصفها أبوها بأنها أجمل أيم (امرأة لا زوج لها) في العرب',
      claims: ['asma-bint-al-numan-al-kindiyyah-siyar/appearance'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    {
      type: 'DAUGHTER',
      inverse: 'FATHER',
      to: 'al-numan-ibn-abi-al-jawn-al-kindi',
      claims: ['asma-bint-al-numan-al-kindiyyah-siyar/father'],
    },
    {
      type: 'WIFE',
      inverse: 'HUSBAND',
      to: 'al-muhajir-ibn-abi-umayyah-al-makhzumi',
      claims: ['asma-bint-al-numan-al-kindiyyah-siyar/husband-al-muhajir'],
    },
  ],
} satisfies CatalogPerson;

export default asmaBintAlNumanAlKindiyyah;
