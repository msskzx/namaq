import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// Carried from the old seed when its rows were retired. The Siyar entry is
// silent about this battle, so both values are in use with their evidence owed.
const hunayn = {
  kind: 'BATTLE',
  slug: 'hunayn',
  name: 'غزوة حنين',
  nameTransliterated: 'Battle of Hunayn',
  fields: {
    engagement: { value: 'GHAZWAH', claims: legacyUnreviewed },
    hijriYear: { value: 8, claims: legacyUnreviewed },
    // Carried from the retired prisma/battleSeedData.ts entry, uncited.
    location: { value: 'حنين', claims: legacyUnreviewed },
  },
  participants: [
    { person: 'abu-ubaydah-ibn-al-jarrah', isMuslim: true, claims: legacyUnreviewed },
    // Carried from the old seed when these people left it; no batch places
    // them here yet.
    { person: 'abu-bakr-as-siddiq', isMuslim: true, claims: legacyUnreviewed },
    { person: 'ali-ibn-abi-talib', isMuslim: true, claims: legacyUnreviewed },
    { person: 'prophet-muhammad', isMuslim: true, claims: ['prophet/hunayn'] },
    { person: 'umar-ibn-al-khattab', isMuslim: true, claims: legacyUnreviewed },
    { person: 'al-abbas-ibn-abd-al-muttalib', isMuslim: true, claims: legacyUnreviewed },
    {
      person: 'nawfal-ibn-al-harith',
      isMuslim: true,
      summary: {
        value: 'أَعَانَ رَسُوْلَ اللهِ يَوْمَ حُنَيْنٍ بِثَلاَثَةِ آلاَفِ رُمْحٍ، وَثَبَتَ مَعَهُ يَوْمَئِذٍ.',
        claims: ['nawfal-ibn-al-harith-siyar27/hunayn'],
      },
      claims: ['nawfal-ibn-al-harith-siyar27/hunayn'],
    },
  ],
} satisfies CatalogBattle;

export default hunayn;
