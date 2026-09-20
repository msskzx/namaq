import type { CatalogBattle } from '@/lib/catalog/types';

// Thirty riders against Abu Jahl. Majdi ibn Amr al-Juhani, allied to both
// sides, stepped between them and no fighting followed.
//
// Chapter three places his banner in Ramadan of year one instead and calls it
// أول لواء عقد في الإسلام. That is hamzah/sariyyah-year-alt, DISPUTED.
const sariyyahHamzah = {
  kind: 'BATTLE',
  slug: 'sariyyah-hamzah',
  name: 'بعث حمزة إلى سيف البحر',
  nameTransliterated: 'The Expedition of Hamzah to Sif al-Bahr',
  fields: {
    engagement: { value: 'SARIYYAH', claims: ['hamzah/sariyyah'] },
    hijriYear: { value: 2, claims: ['hamzah/sariyyah'] },
  },
  participants: [
    { person: 'hamzah-ibn-abd-al-muttalib', isMuslim: true, claims: ['hamzah/sariyyah'] },],
} satisfies CatalogBattle;

export default sariyyahHamzah;
