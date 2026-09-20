import type { CatalogBattle } from '@/lib/catalog/types';

// Jumada al-Akhirah of year two, in pursuit of Kurz ibn Jabir after he raided
// Medina. Distinct from badr, which is بدر الكبرى three months later.
const badrAlUla = {
  kind: 'BATTLE',
  slug: 'badr-al-ula',
  name: 'بدر الأولى',
  nameTransliterated: 'The First Badr',
  fields: {
    engagement: { value: 'GHAZWAH', claims: ['sira/badr-ula'] },
    hijriYear: { value: 2, claims: ['sira/badr-ula'] },
  },
  participants: [
    { person: 'prophet-muhammad', isMuslim: true, claims: ['sira/badr-ula'] },],
} satisfies CatalogBattle;

export default badrAlUla;
