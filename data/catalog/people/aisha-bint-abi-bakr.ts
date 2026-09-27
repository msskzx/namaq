import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData9.ts entry. Her FATHER edge
 * (abu-bakr-as-siddiq.ts) and HUSBAND edge (prophet-muhammad.ts) are already
 * declared from the other side.
 */
const aishaBintAbiBakr = {
  kind: 'PERSON',
  slug: 'aisha-bint-abi-bakr',
  name: 'عائشة بنت أبي بكر',
  nameTransliterated: 'Aisha bint Abi Bakr',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عائشة بنت أبي بكر عبد الله بن أبي قحافة عثمان بن عامر بن عمرو بن كعب بن سعد بن تيم بن مرة بن كعب بن لؤي القرشية التيمية',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
    { title: 'siddiqa', claims: legacyUnreviewed },
    { title: 'mother-of-believers', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default aishaBintAbiBakr;
