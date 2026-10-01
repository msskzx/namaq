import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// The entry places him here but never dates the battle, so the year is
// carried from the old seed with its evidence owed.
const fathMakkah = {
  kind: 'BATTLE',
  slug: 'fath-makkah',
  name: 'فتح مكة',
  nameTransliterated: 'Conquest of Mecca',
  fields: {
    engagement: { value: 'GHAZWAH', claims: legacyUnreviewed },
    hijriYear: { value: 8, claims: legacyUnreviewed },
    // Carried from the retired prisma/battleSeedData.ts entry, uncited.
    location: { value: 'مكة المكرمة', claims: legacyUnreviewed },
  },
  participants: [
    // Carried from the old seed when these people left it; no batch places
    // them here yet.
    { person: 'abu-bakr-as-siddiq', isMuslim: true, claims: legacyUnreviewed },
    { person: 'ali-ibn-abi-talib', isMuslim: true, claims: legacyUnreviewed },
    { person: 'prophet-muhammad', isMuslim: true, claims: legacyUnreviewed },
    { person: 'umar-ibn-al-khattab', isMuslim: true, claims: legacyUnreviewed },
    { person: 'uthman-ibn-affan', isMuslim: true, claims: legacyUnreviewed },
    {
      person: 'az-zubayr-ibn-al-awwam',
      isMuslim: true,
      summary: { value: 'أَعْطَاهُ رَسُوْلُ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- يَوْمَ فَتْحِ مَكَّةَ لِوَاءَ سَعْدِ بنِ عُبَادَةَ، فَدَخَلَ الزُّبَيْرُ مَكَّةَ بِلِوَاءَيْنِ.', claims: ['zubayr/fath-makkah'] },
      claims: ['zubayr/fath-makkah'],
    },
    // His own entry gives the conquest as the point his conversion is dated to.
    {
      person: 'suhail-ibn-amr',
      isMuslim: true,
      summary: {
        value: 'تَأَخَّرَ إِسْلاَمُهُ إِلَى يَوْمِ الفَتْحِ، ثُمَّ حَسُنَ إِسْلاَمُهُ.',
        claims: ['suhail-ibn-amr-siyar25/fath-makkah'],
      },
      claims: ['suhail-ibn-amr-siyar25/fath-makkah'],
    },
    // Carried from the old seed when he left it; no batch places him here yet.
    { person: 'al-abbas-ibn-abd-al-muttalib', isMuslim: true, claims: legacyUnreviewed },
    {
      person: 'rabiah-ibn-al-harith',
      isMuslim: true,
      summary: {
        value: 'وَشَهِدَ مَعَهُ الفَتْحَ، وَحُنَيْناً، وَابْتَنَى دَاراً بِالمَدِيْنَةِ.',
        claims: ['rabiah-ibn-al-harith-siyar46/fath-makkah'],
      },
      claims: ['rabiah-ibn-al-harith-siyar46/fath-makkah'],
    },
    // His own entry has the Banu Muawiyah ibn Malik banner with him on the day
    // of the conquest (see data/history/batches/jabr-ibn-atik).
    {
      person: 'jabr-ibn-atik',
      isMuslim: true,
      summary: {
        value: 'كَانَتْ إِلَيْهِ رَايَةُ بَنِي مُعَاوِيَةَ بنِ مَالِكٍ يَوْمَ الفَتْحِ.',
        claims: ['jabr-ibn-atik-siyar/fath-makkah'],
      },
      claims: ['jabr-ibn-atik-siyar/fath-makkah'],
    },
    {
      person: 'at-tufayl-ibn-amr-ad-dawsi',
      isMuslim: true,
      summary: {
        value: 'فَكُنْتُ مَعَ النَّبِيِّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- حَتَّى فَتَحَ مَكَّةَ.',
        claims: ['at-tufayl-ibn-amr-ad-dawsi-siyar75/fath-makkah'],
      },
      claims: ['at-tufayl-ibn-amr-ad-dawsi-siyar75/fath-makkah'],
    },
    {
      person: 'abu-sufyan-ibn-harb',
      isMuslim: true,
      summary: {
        value: 'تَدَارَكَهُ اللهُ بِالإِسْلاَمِ يَوْمَ الفَتْحِ، فَأَسْلَمَ شِبْهَ مُكْرَهٍ خَائِفٍ؛ ثُمَّ بَعْدَ أَيَّامٍ صَلُحَ إِسْلاَمُهُ.',
        claims: ['abu-sufyan-ibn-harb-siyar13/fath-makkah'],
      },
      claims: ['abu-sufyan-ibn-harb-siyar13/fath-makkah'],
    },
  ],
} satisfies CatalogBattle;

export default fathMakkah;
