import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData9.ts entry. Her FATHER edge
 * (prophet-muhammad.ts), HUSBAND edge (abu-al-as-ibn-al-rabi.ts) and MOTHER
 * edge (umamah-bint-abi-al-as.ts) are already declared from the other side.
 */
const zaynabBintMuhammad = {
  kind: 'PERSON',
  slug: 'zaynab-bint-muhammad',
  name: 'زينب بنت محمد',
  nameTransliterated: 'Zaynab bint Muhammad',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'زينب بنت محمد بن عبد الله بن عبد المطلب بن هاشم القرشية الهاشمية',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default zaynabBintMuhammad;
