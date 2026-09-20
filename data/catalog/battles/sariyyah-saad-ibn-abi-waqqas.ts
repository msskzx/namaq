import type { CatalogBattle } from '@/lib/catalog/types';

// Eight Muhajirun as far as al-Khuwwar, then back. al-Waqidi places a banner
// for him in Dhu al-Qadah of year one as well.
const sariyyahSaadIbnAbiWaqqas = {
  kind: 'BATTLE',
  slug: 'sariyyah-saad-ibn-abi-waqqas',
  name: 'سرية سعد بن أبي وقاص',
  nameTransliterated: 'The Expedition of Sad ibn Abi Waqqas',
  fields: {
    engagement: { value: 'SARIYYAH', claims: ['saad/sariyyah'] },
    hijriYear: { value: 2, claims: ['saad/sariyyah'] },
  },
  participants: [
    { person: 'saad-ibn-abi-waqqas', isMuslim: true, claims: ['saad/sariyyah'] },],
} satisfies CatalogBattle;

export default sariyyahSaadIbnAbiWaqqas;
