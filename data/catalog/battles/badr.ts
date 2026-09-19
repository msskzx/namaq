import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// He killed his own father here, so the SON relation is not in tension with this.
const badr = {
  kind: 'BATTLE',
  slug: 'badr',
  // Carried from the old seed, which an earlier agent extracted from this same
  // work without citations. The entry does not date it, so the evidence is
  // still owed (AGENTS.md, "Historical evidence data").
  fields: { hijriYear: { value: 2, claims: legacyUnreviewed } },
  participants: [
    {
      person: 'saad-ibn-abi-waqqas',
      isMuslim: true,
      status: ['CAPTURED'],
      summary: {
        value:
          'لَقَدْ رَأَيْتُ سَعْداً يُقَاتِلُ يَوْمَ بَدْرٍ قِتَالَ الفَارِسِ فِي الرِّجَالِ. اشْتَرَكْتُ أَنَا، وَسَعْدٌ، وَعَمَّارٌ، يَوْمَ بَدْرٍ فِيْمَا أَصَبْنَا مِنَ الغَنِيْمَةِ، فَجَاءَ سَعْدٌ بِأَسِيْرَيْنِ، وَلَمْ أَجِئْ أَنَا وَعَمَّارٌ بِشَيْءٍ.',
        claims: ['saad/badr'],
      },
      claims: ['saad/badr'],
    },
    {
      person: 'abdur-rahman-ibn-awf',
      isMuslim: true,
      summary: {
        value:
          'وَمِنْ مَنَاقِبِهِ: أَنَّ النَّبِيَّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- شَهِدَ لَهُ بِالجَنَّةِ، وَأَنَّهُ مِنْ أَهْلِ بَدْرٍ الَّذِيْنَ قِيْلَ لَهُم: (اعْمَلُوا مَا شِئْتُم) .',
        claims: ['awf/badr'],
      },
      claims: ['awf/badr'],
    },
    { person: 'abu-ubaydah-ibn-al-jarrah', isMuslim: true, claims: ['abu-ubaydah/badr'] },
    // The old seed had him present here with no status at all. He was away
    // trading in Syria, and given the share and the reward all the same.
    {
      person: 'talhah-ibn-ubaydullah',
      isMuslim: true,
      relation: 'ABSENT_FROM',
      status: ['ABSENT_EXCUSED'],
      summary: {
        value:
          'غَابَ عَنْ وَقْعَة بَدْرٍ فِي تِجَارَةٍ لَهُ بِالشَّامِ، وَتَأَلَّمَ لِغَيْبَتِهِ، فَضَرَبَ لَهُ رَسُوْلُ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- بِسَهْمِهِ، وَأَجره.',
        claims: ['talhah/badr'],
      },
      claims: ['talhah/badr'],
    },
    {
      person: 'az-zubayr-ibn-al-awwam',
      isMuslim: true,
      status: ['INJURED'],
      summary: {
        value:
          'كَانَ يَوْمَ بَدْرٍ مَعَ رَسُوْلِ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- فَارِسَانِ: الزُّبَيْرُ عَلَى فَرَسٍ، عَلَى المَيْمَنَةِ، وَالمِقْدَادُ بنُ الأَسْوَدِ عَلَى فَرَسٍ، عَلَى المَيْسَرَةِ.',
        claims: ['zubayr/badr'],
      },
      claims: ['zubayr/badr'],
    },
  ],
} satisfies CatalogBattle;

export default badr;
