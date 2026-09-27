import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData9.ts entry. Renamed from
 * "fatimah-al-zahra"/"فاطمة الزهراء" for consistency with her sisters'
 * slug/name convention (zaynab-bint-muhammad, ruqayyah-bint-muhammad,
 * umm-kulthum-bint-muhammad). Her FATHER edge (prophet-muhammad.ts) and
 * HUSBAND edge (ali-ibn-abi-talib.ts) are already declared from the other
 * side.
 */
const fatimahBintMuhammad = {
  kind: 'PERSON',
  slug: 'fatimah-bint-muhammad',
  name: 'فاطمة بنت محمد',
  nameTransliterated: 'Fatimah bint Muhammad',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'فاطمة بنت محمد بن عبد الله بن عبد المطلب بن هاشم القرشية الهاشمية',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
    { title: 'sayyidat-nisa-ahl-al-jannah', name: 'سيدة نساء أهل الجنة', nameTransliterated: 'Mistress of the Women of Paradise', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default fatimahBintMuhammad;
