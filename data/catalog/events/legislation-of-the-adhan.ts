import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The chapter names two men who were shown the adhan, عبد الله بن زيد and
 * Umar, and gives no patronymic for the first. Two subjects in the app carry
 * that name (abdullah-ibn-zayd-ibn-abd-rabbih and abdullah-ibn-zayd-al-najjari),
 * and picking between them would take knowledge this source does not supply,
 * so only Umar is linked. The description keeps both names as the book gives
 * them.
 */
const legislationOfTheAdhan = {
  kind: 'EVENT',
  slug: 'legislation-of-the-adhan',
  name: 'مشروعية الأذان',
  nameTransliterated: 'The Legislation of the Adhan',
  type: 'OTHER',
  fields: {
    hijriYear: { value: 1, claims: ['sira/adhan'] },
    description: {
      value: 'أرِيَ الأذان عبد الله بن زيد، وعمر بن الخطاب، فشرع الأذان على ما رأيا.',
      claims: ['sira/adhan'],
    },
  },
  people: [
    { person: 'prophet-muhammad', claims: ['sira/adhan'] },
    { person: 'umar-ibn-al-khattab', claims: ['umar/adhan'] },
  ],
} satisfies CatalogEvent;

export default legislationOfTheAdhan;
