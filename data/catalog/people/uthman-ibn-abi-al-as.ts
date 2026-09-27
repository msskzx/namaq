import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData11.ts entry. Distinct from
 * abi-al-as-ibn-umayya (an Umayyad, unrelated) -- this is a Thaqafi from
 * al-Ta'if; no further ancestor chain given beyond his father's kunya, so
 * none is modelled.
 */
const uthmanIbnAbiAlAs = {
  kind: 'PERSON',
  slug: 'uthman-ibn-abi-al-as',
  name: 'عثمان بن أبي العاص',
  nameTransliterated: 'Uthman ibn Abi al-As',
  hasProfile: true,
  fields: {
    fullName: { value: 'عثمان بن أبي العاص الثقفي الطائفي', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default uthmanIbnAbiAlAs;
