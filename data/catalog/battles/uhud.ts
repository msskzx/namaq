import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

const uhud = {
  kind: 'BATTLE',
  slug: 'uhud',
  // Carried from the old seed, which an earlier agent extracted from this same
  // work without citations. The entry does not date it, so the evidence is
  // still owed (AGENTS.md, "Historical evidence data").
  fields: { hijriYear: { value: 3, claims: legacyUnreviewed } },
  participants: [
    {
      person: 'saad-ibn-abi-waqqas',
      isMuslim: true,
      summary: {
        value:
          'أَنَّهُ رَمَى يَوْمَ أُحُدٍ، قَالَ: فَلَقَدْ رَأَيْتُ رَسُوْلَ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- يُنَاوِلُنِي النَّبْلَ وَيَقُوْلُ: (ارْمِ فِدَاكَ أَبِي وَأُمِّي) ، حَتَّى إِنَّهُ لَيُنَاوِلُنِي السَّهْمَ مَا لَهُ مِنْ نَصْلٍ، فَأَرْمِي بِهِ.',
        claims: ['saad/uhud'],
      },
      claims: ['saad/uhud'],
    },
    {
      person: 'abdur-rahman-ibn-awf',
      isMuslim: true,
      status: ['INJURED'],
      summary: {
        value:
          'كَانَ أُصِيْبَ يَوْمَ أُحُدٍ فُهُتِمَ، وَجُرِحَ عِشْرِيْنَ جِرَاحَةً، بَعْضُهَا فِي رِجْلِهِ فَعَرَجَ.',
        claims: ['awf/uhud'],
      },
      claims: ['awf/uhud'],
    },
    { person: 'abu-ubaydah-ibn-al-jarrah', isMuslim: true, claims: ['abu-ubaydah/uhud'] },
    {
      person: 'talhah-ibn-ubaydullah',
      isMuslim: true,
      status: ['INJURED'],
      summary: {
        value: 'فَقَاتَلَ طَلْحَةُ قِتَالَ الأَحَد عَشَر، حَتَّى قُطِعَتْ أَصَابِعُهُ.',
        claims: ['talhah/uhud'],
      },
      claims: ['talhah/uhud'],
    },
    {
      person: 'az-zubayr-ibn-al-awwam',
      isMuslim: true,
      summary: {
        value:
          'فَانْتُدِبَ أَبُو بَكْرٍ وَالزُّبَيْرُ فِي سَبْعِيْنَ، فَخَرَجُوا فِي آثَارِ المُشْرِكِيْنَ، فَسَمِعُوا بِهِم، فَانْصَرَفُوا.',
        claims: ['zubayr/uhud'],
      },
      claims: ['zubayr/uhud'],
    },
    // One sentence of his own account settles all three: the enslavement that
    // kept him from Badr and Uhud, and the Khandaq he did reach.
    {
      person: 'salman-al-farisi',
      isMuslim: true,
      relation: 'ABSENT_FROM',
      status: ['ABSENT_EXCUSED'],
      summary: {
        value: 'وحبسني الرق حتى فاتتني بدر وأحد.',
        claims: ['salman/uhud'],
      },
      claims: ['salman/uhud'],
    },
  ],
} satisfies CatalogBattle;

export default uhud;
