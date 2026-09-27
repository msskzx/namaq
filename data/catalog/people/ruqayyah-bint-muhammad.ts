import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData9.ts entry. Her FATHER edge
 * (prophet-muhammad.ts) and HUSBAND edge (uthman-ibn-affan.ts, her second
 * marriage) are already declared from the other side. Her first marriage to
 * Utbah ibn Abi Lahab, annulled before consummation per the retired entry,
 * is not modeled, consistent with how other wives' failed prior marriages
 * are left out of the graph.
 */
const ruqayyahBintMuhammad = {
  kind: 'PERSON',
  slug: 'ruqayyah-bint-muhammad',
  name: 'رقية بنت محمد',
  nameTransliterated: 'Ruqayyah bint Muhammad',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'رقية بنت محمد بن عبد الله بن عبد المطلب بن هاشم القرشية الهاشمية',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default ruqayyahBintMuhammad;
