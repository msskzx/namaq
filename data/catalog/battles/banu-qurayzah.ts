import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

// The entry places him here but never dates the battle, so the year is
// carried from the old seed with its evidence owed.
const banuQurayzah = {
  kind: 'BATTLE',
  slug: 'banu-qurayzah',
  name: 'غزوة بني قريظة',
  nameTransliterated: 'Siege of Banu Qurayzah',
  fields: { engagement: { value: 'GHAZWAH', claims: legacyUnreviewed }, hijriYear: { value: 5, claims: legacyUnreviewed } },
  participants: [
    {
      person: 'az-zubayr-ibn-al-awwam',
      isMuslim: true,
      summary: { value: 'كَانَ يَمُرُّ إِلَى بَنِي قُرَيْظَةَ، فَيُقَاتِلُهُمْ.', claims: ['zubayr/banu-qurayzah'] },
      claims: ['zubayr/banu-qurayzah'],
    },
  ],
} satisfies CatalogBattle;

export default banuQurayzah;
