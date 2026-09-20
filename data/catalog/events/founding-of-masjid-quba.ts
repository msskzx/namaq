import type { CatalogEvent } from '@/lib/catalog/types';

// Founded during the stay with Banu Amr ibn Awf, before he moved on to build
// his own mosque. The chapter's heading dates it to the first year.
const foundingOfMasjidQuba = {
  kind: 'EVENT',
  slug: 'founding-of-masjid-quba',
  name: 'تأسيس مسجد قباء',
  nameTransliterated: 'Founding of Masjid Quba',
  type: 'OTHER',
  fields: {
    hijriYear: { value: 1, claims: ['sira/masjid-quba'] },
    location: { value: 'قباء، في بني عمرو بن عوف', claims: ['sira/masjid-quba'] },
    description: {
      value: 'أسس رسول الله صلى الله عليه وسلم في إقامته ببني عمرو بن عوف مسجد قباء، ثم صلى الجمعة في بني سالم في بطن الوادي.',
      claims: ['sira/masjid-quba'],
    },
  },
  people: [{ person: 'prophet-muhammad', claims: ['sira/masjid-quba'] }],
} satisfies CatalogEvent;

export default foundingOfMasjidQuba;
