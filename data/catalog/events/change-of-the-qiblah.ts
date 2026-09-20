import type { CatalogEvent } from '@/lib/catalog/types';

// Rajab of year two, which the chapter gives with an أو قريبا منه the model
// cannot hold; only the year goes in the field.
const changeOfTheQiblah = {
  kind: 'EVENT',
  slug: 'change-of-the-qiblah',
  name: 'تحويل القبلة',
  nameTransliterated: 'The Change of the Qiblah',
  type: 'OTHER',
  fields: {
    hijriYear: { value: 2, claims: ['sira/qiblah'] },
    description: { value: 'وصرفت القبلة في رجب، أو قريبا منه.', claims: ['sira/qiblah'] },
  },
  people: [{ person: 'prophet-muhammad', claims: ['sira/qiblah'] }],
} satisfies CatalogEvent;

export default changeOfTheQiblah;
