import type { CatalogEvent } from '@/lib/catalog/types';

// The same Ramadan as Badr. The chapter puts three things in it: the fast
// made obligatory, Ashura's obligation abrogated, and the fitrah at its end.
const obligationOfFastingRamadan = {
  kind: 'EVENT',
  slug: 'obligation-of-fasting-ramadan',
  name: 'فرض صوم رمضان',
  nameTransliterated: 'The Obligation of Fasting Ramadan',
  type: 'OTHER',
  fields: {
    hijriYear: { value: 2, claims: ['sira/fasting-ramadan'] },
    description: {
      value: 'وفي رمضان: فرض الله صوم رمضان، ونسخ فرضية يوم عاشوراء. وفي آخره: فرضت الفطرة.',
      claims: ['sira/fasting-ramadan'],
    },
  },
  people: [{ person: 'prophet-muhammad', claims: ['sira/fasting-ramadan'] }],
} satisfies CatalogEvent;

export default obligationOfFastingRamadan;
