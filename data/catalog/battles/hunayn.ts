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
    {
      person: 'yazid-ibn-abi-sufyan',
      isMuslim: true,
      summary: { value: 'وَشَهِدَ حُنَيْناً.', claims: ['yazid-ibn-abi-sufyan-siyar68/hunayn'] },
      claims: ['yazid-ibn-abi-sufyan-siyar68/hunayn'],
    },
    { person: 'abu-ubaydah-ibn-al-jarrah', isMuslim: true, claims: legacyUnreviewed },
    // Carried from the old seed when these people left it; no batch places
    // them here yet.
    { person: 'abu-bakr-as-siddiq', isMuslim: true, claims: legacyUnreviewed },
    { person: 'ali-ibn-abi-talib', isMuslim: true, claims: legacyUnreviewed },
    { person: 'prophet-muhammad', isMuslim: true, claims: ['prophet/hunayn'] },
    { person: 'umar-ibn-al-khattab', isMuslim: true, claims: legacyUnreviewed },
    {
      person: 'al-abbas-ibn-abd-al-muttalib',
      isMuslim: true,
      summary: {
        value:
          'كَانَ يَوْمَ حُنِيْنٍ، وَقْتَ الهَزِيْمَةِ، آخِذاً بِلِجَامِ بَغْلَةِ النَّبِيِّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- وَثَبَتَ مَعَهُ حَتَّى نَزَلَ النَّصْرُ وَهُوَ الَّذِي أَمَرَهُ النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- أَن يَهْتِفَ يَوْمَ حُنَيْنٍ: يَا أَصْحَابَ الشَّجَرَةِ',
        claims: ['al-abbas-ibn-abd-al-muttalib-siyar11/hunayn'],
      },
      claims: ['al-abbas-ibn-abd-al-muttalib-siyar11/hunayn'],
    },
    {
      person: 'nawfal-ibn-al-harith',
      isMuslim: true,
      summary: {
        value: 'أَعَانَ رَسُوْلَ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- يَوْمَ حُنَيْنٍ بِثَلاَثَةِ آلاَفِ رُمْحٍ، وَثَبَتَ مَعَهُ يَوْمَئِذٍ',
        claims: ['nawfal-ibn-al-harith-siyar27/hunayn'],
      },
      claims: ['nawfal-ibn-al-harith-siyar27/hunayn'],
    },
    {
      person: 'rabiah-ibn-al-harith',
      isMuslim: true,
      summary: {
        value: 'وَشَهِدَ مَعَهُ الفَتْحَ، وَحُنَيْناً، وَابْتَنَى دَاراً بِالمَدِيْنَةِ.',
        claims: ['rabiah-ibn-al-harith-siyar46/hunayn'],
      },
      claims: ['rabiah-ibn-al-harith-siyar46/hunayn'],
    },
    {
      person: 'abu-sufyan-ibn-al-harith',
      isMuslim: true,
      summary: {
        value: 'وَلَزِمَ هُوَ وَالعَبَّاسُ رَسُوْلَ اللهِ يَوْمَ حُنَيْنٍ إِذْ فَرَّ النَّاسُ، وَأَخَذَ بِلِجَامِ البَغْلَةِ، وَثَبَتَ مَعَهُ.',
        claims: ['abu-sufyan-ibn-al-harith-siyar32/hunayn'],
      },
      claims: ['abu-sufyan-ibn-al-harith-siyar32/hunayn'],
    },
    {
      person: 'abu-sufyan-ibn-harb',
      isMuslim: true,
      summary: {
        value:
          'فَشَهِدَ حُنَيْناً، وَأَعْطَاهُ صِهْرُهُ رَسُوْلُ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- مِنَ الغَنَائِمِ مائَةً مِنَ الإِبِلِ، وَأَرْبَعِيْنَ أُوْقِيَّةً مِنَ الدَّرَاهِمِ يَتَأَلَّفُهُ بِذَلِكَ',
        claims: ['abu-sufyan-ibn-harb-siyar13/hunayn'],
      },
      claims: ['abu-sufyan-ibn-harb-siyar13/hunayn'],
    },
    {
      person: 'abu-talha-al-ansari',
      isMuslim: true,
      summary: {
        value: 'قَالَ يَوْمَ حُنَيْنٍ: (مَنْ قَتَلَ قَتِيْلاً فَلَهُ سَلَبُهُ) فَقَتَلَ أَبُو طَلْحَةَ يَوْمَئِذٍ عِشْرِيْنَ رَجُلاً، وَأَخَذَ أَسْلاَبَهُمْ',
        claims: ['abu-talha-al-ansari-siyar5/hunayn'],
      },
      claims: ['abu-talha-al-ansari-siyar5/hunayn'],
    },
    {
      person: 'abu-dharr-al-ghifari',
      isMuslim: true,
      summary: {
        value: 'كَانَ حَامِلَ رَايَةِ غِفَارَ يَوْمَ حُنَيْنٍ',
        claims: ['abu-dharr-al-ghifari-siyar10/hunayn'],
      },
      claims: ['abu-dharr-al-ghifari-siyar10/hunayn'],
    },
  ],
} satisfies CatalogBattle;

export default hunayn;
