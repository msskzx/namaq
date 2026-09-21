import type { CatalogBattle } from '@/lib/catalog/types';

/**
 * Ibn Ishaq has him set out for Quraysh and al-Waqidi for Banu Sulaym, and the
 * two disagree on the month as well. The model records neither target, so the
 * disagreement stays on the page; what it does record -- a غزوة of year three
 * at Bahran that ended ولم يلق كيدا -- both accounts give.
 */
const ghazwahBahran = {
  kind: 'BATTLE',
  slug: 'ghazwah-bahran',
  name: 'غزوة بحران',
  nameTransliterated: 'The Expedition of Bahran',
  fields: {
    engagement: { value: 'GHAZWAH', claims: ['sira/bahran'] },
    hijriYear: { value: 3, claims: ['sira/bahran'] },
    location: { value: 'بحران، معدن بالحجاز من ناحية الفرع', claims: ['sira/bahran'] },
  },
  participants: [{ person: 'prophet-muhammad', isMuslim: true, claims: ['sira/bahran'] }],
} satisfies CatalogBattle;

export default ghazwahBahran;
