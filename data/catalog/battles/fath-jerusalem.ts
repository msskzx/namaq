import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// Carried from the old seed when its rows were retired. The Siyar entry is
// silent about this battle, so both values are in use with their evidence owed.
const fathJerusalem = {
  kind: 'BATTLE',
  slug: 'fath-jerusalem',
  name: 'فتح بيت المقدس',
  nameTransliterated: 'Conquest of Jerusalem',
  fields: {
    engagement: { value: 'BATTLE', claims: legacyUnreviewed },
    hijriYear: { value: 16, claims: legacyUnreviewed },
    // Carried from the retired prisma/battleSeedData.ts entry, uncited.
    location: { value: 'القدس', claims: legacyUnreviewed },
  },
  participants: [
    { person: 'abu-ubaydah-ibn-al-jarrah', isMuslim: true, claims: legacyUnreviewed },
    // Carried from the old seed when these people left it; no batch places
    // them here yet.
    { person: 'umar-ibn-al-khattab', isMuslim: true, claims: legacyUnreviewed },
    {
      person: 'abu-dharr-al-ghifari',
      isMuslim: true,
      summary: {
        value: 'شَهِدَ فَتْحَ بَيْتِ المَقْدِسِ مَعَ عُمَرَ.',
        claims: ['abu-dharr-al-ghifari-siyar10/fath-jerusalem'],
      },
      claims: ['abu-dharr-al-ghifari-siyar10/fath-jerusalem'],
    },
  ],
} satisfies CatalogBattle;

export default fathJerusalem;
