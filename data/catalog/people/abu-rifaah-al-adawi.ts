import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData14.ts entry. His own page
 * gives an alternate identity per Khalifah ("Abdullah ibn al-Harith, of
 * Banu Adi al-Rabab") -- the header name is used here.
 */
const abuRifaahAlAdawi = {
  kind: 'PERSON',
  slug: 'abu-rifaah-al-adawi',
  name: 'أبو رفاعة العدوي',
  nameTransliterated: 'Abu Rifaah al-Adawi',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'تميم بن أسيد بن عدي بن عبد مناة بن أد بن طابخة المضري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abuRifaahAlAdawi;
