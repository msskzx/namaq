import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData10.ts entry. Father named,
 * no deeper chain given, so no separate ancestor node. Among the wives the
 * Prophet "deferred" per the Qur'anic allowance, per the retired entry.
 */
const khawlahBintHakim = {
  kind: 'PERSON',
  slug: 'khawlah-bint-hakim',
  name: 'خولة بنت حكيم',
  nameTransliterated: 'Khawlah bint Hakim',
  hasProfile: true,
  fields: {
    fullName: { value: 'خولة بنت حكيم', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default khawlahBintHakim;
