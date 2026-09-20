import type { CatalogEvent } from '@/lib/catalog/types';

// Ramadan of year three, which the chapter gives without a day.
const birthOfAlHasan = {
  kind: 'EVENT',
  slug: 'birth-of-al-hasan',
  name: 'مولد الحسن بن علي',
  nameTransliterated: 'The Birth of al-Hasan ibn Ali',
  type: 'BIRTH',
  fields: {
    hijriYear: { value: 3, claims: ['hasan/birth'] },
    description: { value: 'وفي رمضان: ولد السيد أبو محمد الحسن بن علي.', claims: ['hasan/birth'] },
  },
  people: [{ person: 'al-hasan-ibn-ali', claims: ['hasan/birth'] }],
} satisfies CatalogEvent;

export default birthOfAlHasan;
