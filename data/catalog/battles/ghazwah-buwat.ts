import type { CatalogBattle } from '@/lib/catalog/types';

// Rabi al-Awwal of year two. ولم يلق حربا, which is why a سرية and a غزوة
// both need recording: neither is defined by whether fighting happened.
const ghazwahBuwat = {
  kind: 'BATTLE',
  slug: 'ghazwah-buwat',
  name: 'غزوة بواط',
  nameTransliterated: 'The Expedition of Buwat',
  fields: {
    engagement: { value: 'GHAZWAH', claims: ['sira/buwat'] },
    hijriYear: { value: 2, claims: ['sira/buwat'] },
  },
  participants: [
    { person: 'prophet-muhammad', isMuslim: true, claims: ['sira/buwat'] },],
} satisfies CatalogBattle;

export default ghazwahBuwat;
