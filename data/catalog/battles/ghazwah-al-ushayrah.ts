import type { CatalogBattle } from '@/lib/catalog/types';

// Jumada al-Ula of year two, and where Ali got the kunya أبو تراب: he and
// Ammar fell asleep in the dust watching Banu Mudlij work their spring.
const ghazwahAlUshayrah = {
  kind: 'BATTLE',
  slug: 'ghazwah-al-ushayrah',
  name: 'غزوة العشيرة',
  nameTransliterated: 'The Expedition of al-Ushayrah',
  fields: {
    engagement: { value: 'GHAZWAH', claims: ['sira/ushayrah'] },
    hijriYear: { value: 2, claims: ['sira/ushayrah'] },
  },
  participants: [
    { person: 'prophet-muhammad', isMuslim: true, claims: ['sira/ushayrah'] },
    { person: 'ali-ibn-abi-talib', isMuslim: true, claims: ['ali/ushayrah'] },
    { person: 'ammar-ibn-yasir', isMuslim: true, claims: ['ammar/ushayrah'] },],
} satisfies CatalogBattle;

export default ghazwahAlUshayrah;
