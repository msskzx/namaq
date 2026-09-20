import type { CatalogBattle } from '@/lib/catalog/types';

// Abdullah ibn Jahsh carried sealed orders he was not to open for two days.
// The killing of Ibn al-Hadrami fell in a sacred month, which the Prophet
// disowned and al-Baqarah 217 answered. Its leader has no subject here yet.
const sariyyahNakhlah = {
  kind: 'BATTLE',
  slug: 'sariyyah-nakhlah',
  name: 'سرية نخلة',
  nameTransliterated: 'The Expedition of Nakhlah',
  fields: {
    engagement: { value: 'SARIYYAH', claims: ['sira/nakhlah'] },
    hijriYear: { value: 2, claims: ['sira/nakhlah'] },
  },
  participants: [
    { person: 'prophet-muhammad', isMuslim: true, claims: ['sira/nakhlah'] },],
} satisfies CatalogBattle;

export default sariyyahNakhlah;
