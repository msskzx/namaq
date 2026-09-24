import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

/**
 * Chapter seven is the first text in this batch to describe the battle rather
 * than mention it, and it gives the two counts outright: عشرة آلاف against
 * ثلاثة آلاف. The year and the engagement come off the legacy marker with it.
 *
 * The month does not. al-Waqidi puts it in ذو القعدة and Ibn Ishaq in شوال,
 * and chapter six carried a third reading dating the whole battle to سنة أربع.
 * The model holds a year and not a month, so the disagreement stays in the
 * pages rather than becoming DISPUTED claims with no value to compete over.
 */
const khandaq = {
  kind: 'BATTLE',
  slug: 'khandaq',
  name: 'غزوة الخندق',
  nameTransliterated: 'Battle of the Trench',
  fields: {
    engagement: { value: 'GHAZWAH', claims: ['khandaq/engagement'] },
    hijriYear: { value: 5, claims: ['khandaq/year'] },
    muslimForceCount: { value: 3000, claims: ['khandaq/muslim-force'] },
    nonMuslimForceCount: { value: 10000, claims: ['khandaq/confederate-force'] },
  },
  participants: [
    { person: 'saad-ibn-muadh', isMuslim: true, status: ['INJURED'], claims: ['saad-muadh/khandaq-wound'] },
    // Carried from the old seed when these people left it; no batch places
    // them here yet.
    { person: 'abu-bakr-as-siddiq', isMuslim: true, claims: legacyUnreviewed },
    { person: 'ali-ibn-abi-talib', isMuslim: true, claims: legacyUnreviewed },
    { person: 'prophet-muhammad', isMuslim: true, claims: legacyUnreviewed },
    { person: 'umar-ibn-al-khattab', isMuslim: true, claims: legacyUnreviewed },
    { person: 'uthman-ibn-affan', isMuslim: true, claims: legacyUnreviewed },
    { person: 'saeed-ibn-zaid', isMuslim: true, claims: ['saeed/khandaq'] },
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
