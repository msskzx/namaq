import type { CatalogBattle } from '@/lib/catalog/types';

// Seven days after returning from Badr. He reached al-Kudr, waited three days
// and met no one.
const ghazwahBaniSulaym = {
  kind: 'BATTLE',
  slug: 'ghazwah-bani-sulaym',
  name: 'غزوة بني سليم',
  nameTransliterated: 'The Expedition against Banu Sulaym',
  fields: {
    engagement: { value: 'GHAZWAH', claims: ['sira/bani-sulaym'] },
    hijriYear: { value: 2, claims: ['sira/bani-sulaym'] },
  },
  participants: [
    { person: 'prophet-muhammad', isMuslim: true, claims: ['sira/bani-sulaym'] },],
} satisfies CatalogBattle;

export default ghazwahBaniSulaym;
