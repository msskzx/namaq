import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// The entry places him here but never dates the battle, so the year is
// carried from the old seed with its evidence owed.
const fathMakkah = {
  kind: 'BATTLE',
  slug: 'fath-makkah',
  fields: { hijriYear: { value: 8, claims: legacyUnreviewed } },
  participants: [
    {
      person: 'az-zubayr-ibn-al-awwam',
      isMuslim: true,
      summary: { value: 'أَعْطَاهُ رَسُوْلُ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- يَوْمَ فَتْحِ مَكَّةَ لِوَاءَ سَعْدِ بنِ عُبَادَةَ، فَدَخَلَ الزُّبَيْرُ مَكَّةَ بِلِوَاءَيْنِ.', claims: ['zubayr/fath-makkah'] },
      claims: ['zubayr/fath-makkah'],
    },
  ],
} satisfies CatalogBattle;

export default fathMakkah;
