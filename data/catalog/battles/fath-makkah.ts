import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// The entry places him here but never dates the battle, so the year is
// carried from the old seed with its evidence owed.
const fathMakkah = {
  kind: 'BATTLE',
  slug: 'fath-makkah',
  name: 'فتح مكة',
  nameTransliterated: 'Conquest of Mecca',
  fields: { engagement: { value: 'GHAZWAH', claims: legacyUnreviewed }, hijriYear: { value: 8, claims: legacyUnreviewed } },
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
  ],
} satisfies CatalogBattle;

export default fathMakkah;
