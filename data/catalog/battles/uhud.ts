import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

const uhud = {
  kind: 'BATTLE',
  slug: 'uhud',
  // Carried from the old seed, which an earlier agent extracted from this same
  // work without citations. The entry does not date it, so the evidence is
  // still owed (AGENTS.md, "Historical evidence data").
  fields: { hijriYear: { value: 3, claims: legacyUnreviewed } },
  participants: [
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
  ],
} satisfies CatalogBattle;

export default uhud;
