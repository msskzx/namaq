import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData15.ts entry. Son of Hatim
 * al-Tai, the pre-Islamic Arab paragon of generosity -- not modelled as a
 * separate node.
 */
const adiIbnHatim = {
  kind: 'PERSON',
  slug: 'adi-ibn-hatim',
  name: 'عدي بن حاتم',
  nameTransliterated: 'Adi ibn Hatim',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عدي بن حاتم بن عبد الله بن سعد بن الحشرج بن امرئ القيس بن عدي الطائي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default adiIbnHatim;
