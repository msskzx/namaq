import type { CatalogBattle } from '@/lib/catalog/types';

// Dhu al-Hijjah of year two. Abu Sufyan had sworn not to wash until he
// raided; he burnt palms at al-Urayd and fled, and his men threw down their
// سويق to run lighter, which is what the expedition is named for.
const ghazwahAsSawiq = {
  kind: 'BATTLE',
  slug: 'ghazwah-as-sawiq',
  name: 'غزوة السويق',
  nameTransliterated: 'The Expedition of as-Sawiq',
  fields: {
    engagement: { value: 'GHAZWAH', claims: ['sira/sawiq'] },
    hijriYear: { value: 2, claims: ['sira/sawiq'] },
  },
  participants: [
    { person: 'prophet-muhammad', isMuslim: true, claims: ['sira/sawiq'] },],
} satisfies CatalogBattle;

export default ghazwahAsSawiq;
