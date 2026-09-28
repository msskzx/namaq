import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData14.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. His own page calls him "akhu Uthman min al-ridaah" -- Uthman ibn
 * Affan's brother through breastfeeding, not blood -- not modelled as a
 * family relation (no such tie in this graph).
 */
const abdullahIbnSaadIbnAbiSarh = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-saad-ibn-abi-sarh',
  name: 'عبد الله بن سعد بن أبي سرح',
  nameTransliterated: 'Abdullah ibn Saad ibn Abi Sarh',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عبد الله بن سعد بن أبي سرح بن الحارث القرشي العامري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abdullahIbnSaadIbnAbiSarh;
