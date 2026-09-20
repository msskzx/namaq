import type { CatalogBattle } from '@/lib/catalog/types';

// Sixty riders to Thaniyyat al-Murrah. No fighting, but Sad ibn Abi Waqqas
// loosed an arrow here, أول سهم رمي في سبيل الله.
const sariyyahUbaydah = {
  kind: 'BATTLE',
  slug: 'sariyyah-ubaydah',
  name: 'بعث عبيدة بن الحارث',
  nameTransliterated: 'The Expedition of Ubaydah ibn al-Harith',
  fields: {
    engagement: { value: 'SARIYYAH', claims: ['ubaydah/sariyyah'] },
    hijriYear: { value: 2, claims: ['ubaydah/sariyyah'] },
  },
  participants: [
    { person: 'ubaydah-ibn-al-harith', isMuslim: true, claims: ['ubaydah/sariyyah'] },
    { person: 'saad-ibn-abi-waqqas', isMuslim: true, claims: ['saad/sariyyah-ubaydah'] },],
} satisfies CatalogBattle;

export default sariyyahUbaydah;
