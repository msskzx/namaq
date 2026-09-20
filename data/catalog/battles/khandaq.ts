import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// Neither entry mentions Khandaq, so nothing here is cited. The module exists
// to carry what the retired seed rows held rather than lose it.
const khandaq = {
  kind: 'BATTLE',
  slug: 'khandaq',
  name: 'غزوة الخندق',
  nameTransliterated: 'Battle of the Trench',
  fields: { engagement: { value: 'GHAZWAH', claims: legacyUnreviewed }, hijriYear: { value: 5, claims: legacyUnreviewed } },
  participants: [
    {
      person: 'saad-ibn-abi-waqqas',
      isMuslim: true,
      summary: {
        value:
          'لَقَدْ رَأَيْتُ رَسُوْلَ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- ضَحِكَ يوْمَ الخَنْدَقِ حَتَّى بَدَتْ نَوَاجِذُهُ. كَانَ رَجُلٌ مَعَهُ تُرْسٌ، وَكَانَ سَعْدٌ رَامِياً، فَنَزَعَ لَهُ سَعْدٌ بِسَهْمٍ، فَلَمَّا رَفَعَ رَأْسَهُ رَمَاهُ، فَلَمْ يُخْطِ جَبْهَتَهُ.',
        claims: ['saad/khandaq'],
      },
      claims: ['saad/khandaq'],
    },
    { person: 'talhah-ibn-ubaydullah', isMuslim: true, claims: legacyUnreviewed },
    { person: 'abdur-rahman-ibn-awf', isMuslim: true, claims: legacyUnreviewed },
    { person: 'abu-ubaydah-ibn-al-jarrah', isMuslim: true, claims: legacyUnreviewed },
    {
      person: 'az-zubayr-ibn-al-awwam',
      isMuslim: true,
      summary: {
        value:
          'ضَرَبَ الزُّبَيْرُ يَوْمَ الخَنْدَقِ عُثْمَانَ بنَ عَبْدِ اللهِ بنِ المُغِيْرَةِ بِالسَّيْفِ عَلَى مِغْفَرِهِ، فَقَطَعَهُ إِلَى القَرَبُوسِ.',
        claims: ['zubayr/khandaq'],
      },
      claims: ['zubayr/khandaq'],
    },
    {
      person: 'salman-al-farisi',
      isMuslim: true,
      summary: {
        value: 'ثم شهدت الخندق، ثم لم يفتني معه مشهد.',
        claims: ['salman/khandaq'],
      },
      claims: ['salman/khandaq'],
    },
  ],
} satisfies CatalogBattle;

export default khandaq;
