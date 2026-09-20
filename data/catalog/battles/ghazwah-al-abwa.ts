import type { CatalogBattle } from '@/lib/catalog/types';

// Safar of year two, the first he led in person. No fighting: he made a pact
// with Banu Damrah and turned back.
const ghazwahAlAbwa = {
  kind: 'BATTLE',
  slug: 'ghazwah-al-abwa',
  name: 'غزوة الأبواء',
  nameTransliterated: 'The Expedition of al-Abwa',
  fields: {
    engagement: { value: 'GHAZWAH', claims: ['sira/abwa'] },
    hijriYear: { value: 2, claims: ['sira/abwa'] },
  },
  participants: [
    { person: 'prophet-muhammad', isMuslim: true, claims: ['sira/abwa'] },],
} satisfies CatalogBattle;

export default ghazwahAlAbwa;
