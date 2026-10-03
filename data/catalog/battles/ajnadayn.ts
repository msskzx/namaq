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
    {
      person: 'aban-ibn-said',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: {
        value: 'اسْتُشْهِدَ هُوَ وَأَخُوْهُ خَالِدٌ يَوْمَ أَجْنَادِيْنَ عَلَى الصَّحِيْحِ',
        claims: ['aban-ibn-said-siyar49/ajnadayn'],
      },
      claims: ['aban-ibn-said-siyar49/ajnadayn'],
    },
    // The entry's own reading is Yarmouk and Ajnadayn is given as the
    // alternative ("ويقال"), so this participation carries the disputed claim
    // and its summary keeps the attribution the source gives it.
    {
      person: 'amr-ibn-said-al-umawi',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: {
        value: 'وَيُقَالُ: يَوْم أَجْنَادِيْنَ - مَعَ أَخَوَيْهِ -',
        claims: ['amr-ibn-said-al-umawi-siyar50/ajnadayn'],
      },
      claims: ['amr-ibn-said-al-umawi-siyar50/ajnadayn'],
    },
  ],
} satisfies CatalogBattle;

export default ajnadayn;
