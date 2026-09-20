import type { CatalogEvent } from '@/lib/catalog/types';

// She died while Badr was being fought, which is why Uthman is ABSENT_FROM it
// rather than simply missing from the roster.
const deathOfRuqayyah = {
  kind: 'EVENT',
  slug: 'death-of-ruqayyah',
  name: 'وفاة رقية بنت رسول الله ﷺ',
  nameTransliterated: 'The Death of Ruqayyah',
  type: 'DEATH',
  fields: {
    hijriYear: { value: 2, claims: ['sira/death-ruqayyah'] },
    description: {
      value: 'توفيت في العشر الأخير من رمضان، يوم قدوم المسلمين المدينة من بدر، وكان عثمان قد تخلف عن بدر يمرضها.',
      claims: ['sira/death-ruqayyah'],
    },
  },
  people: [{ person: 'ruqayyah-bint-muhammad', claims: ['sira/death-ruqayyah'] }],
} satisfies CatalogEvent;

export default deathOfRuqayyah;
