import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// Carried from the old seed when its rows were retired. The Siyar entry is
// silent about this battle, so both values are in use with their evidence owed.
const ajnadayn = {
  kind: 'BATTLE',
  slug: 'ajnadayn',
  name: 'معركة أجنادين',
  nameTransliterated: 'Battle of Ajnadayn',
  fields: {
    engagement: { value: 'BATTLE', claims: legacyUnreviewed },
    hijriYear: { value: 13, claims: legacyUnreviewed },
    // Carried from the retired prisma/battleSeedData.ts entry, uncited.
    location: { value: 'فلسطين', claims: legacyUnreviewed },
  },
  participants: [
    { person: 'abu-ubaydah-ibn-al-jarrah', isMuslim: true, claims: legacyUnreviewed },
    // Carried from the old seed when these people left it; no batch places
    // them here yet.
    { person: 'abu-bakr-as-siddiq', isMuslim: true, claims: legacyUnreviewed },
    { person: 'umar-ibn-al-khattab', isMuslim: true, claims: legacyUnreviewed },
    {
      person: 'khalid-ibn-said',
      isMuslim: true,
      status: ['MARTYRED'],
      claims: ['khalid-ibn-said-siyar48/ajnadayn'],
    },
  ],
} satisfies CatalogBattle;

export default ajnadayn;
