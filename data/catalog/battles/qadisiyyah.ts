import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// Khalifah ibn Khayyat dates the battle outright, so the year is cited rather
// than carried the way the seeded battles' years are.
const qadisiyyah = {
  kind: 'BATTLE',
  slug: 'qadisiyyah',
  name: 'معركة القادسية',
  nameTransliterated: 'Battle of al-Qadisiyyah',
  fields: { engagement: { value: 'BATTLE', claims: legacyUnreviewed }, hijriYear: { value: 15, claims: ['saad/qadisiyyah'] } },
  participants: [
    // Carried from the old seed when these people left it; no batch places
    // them here yet.
    { person: 'umar-ibn-al-khattab', isMuslim: true, claims: legacyUnreviewed },
    {
      person: 'saad-ibn-abi-waqqas',
      isMuslim: true,
      summary: {
        value:
          'وَمِنْ مَنَاقِبِ سَعْدٍ أَنَّ فَتْحَ العِرَاقِ كَانَ عَلَى يَدَيْ سَعْدٍ، وَهُوَ كَانَ مُقَدَّمَ الجُيُوْشِ يَوْمَ وَقْعَةِ القَادِسِيَّةِ، وَنَصَرَ اللهُ دِيْنَهُ.',
        claims: ['saad/qadisiyyah'],
      },
      claims: ['saad/qadisiyyah'],
    },
  ],
} satisfies CatalogBattle;

export default qadisiyyah;
