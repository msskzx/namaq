import { legacyUnreviewed, type CatalogBattle } from '@/lib/catalog/types';

/**
 * Chapter seven reaches the siege itself. The year is the chapter's own, and
 * the engagement is what the chapter shows: the Prophet went out as soon as he
 * came back from the Khandaq, لا يصلين أحد العصر إلا في بني قريظة.
 *
 * Saad ibn Muadh is here for the judgement they came down to, which killed him
 * — the wound from the Khandaq reopened once he had given it.
 */
const banuQurayzah = {
  kind: 'BATTLE',
  slug: 'banu-qurayzah',
  name: 'غزوة بني قريظة',
  nameTransliterated: 'Siege of Banu Qurayzah',
  fields: {
    engagement: { value: 'GHAZWAH', claims: ['qurayzah/engagement'] },
    hijriYear: { value: 5, claims: legacyUnreviewed },
  },
  participants: [
    { person: 'saad-ibn-muadh', isMuslim: true, status: ['MARTYRED'], claims: ['saad-muadh/qurayzah-judgement'] },
    // Carried from the old seed when these people left it; no batch places
    // them here yet.
    { person: 'ali-ibn-abi-talib', isMuslim: true, claims: legacyUnreviewed },
    { person: 'prophet-muhammad', isMuslim: true, claims: legacyUnreviewed },
    {
      person: 'az-zubayr-ibn-al-awwam',
      isMuslim: true,
      summary: { value: 'كَانَ يَمُرُّ إِلَى بَنِي قُرَيْظَةَ، فَيُقَاتِلُهُمْ.', claims: ['zubayr/banu-qurayzah'] },
      claims: ['zubayr/banu-qurayzah'],
    },
  ],
} satisfies CatalogBattle;

export default banuQurayzah;
