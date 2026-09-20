import type { CatalogEvent } from '@/lib/catalog/types';

// The dower is the one concrete thing the chapter gives: the درع حطمية Ali
// already owned, which he valued at four dirhams.
const marriageOfAliAndFatimah = {
  kind: 'EVENT',
  slug: 'marriage-of-ali-and-fatimah',
  name: 'زواج علي وفاطمة',
  nameTransliterated: 'The Marriage of Ali and Fatimah',
  type: 'MARRIAGE',
  fields: {
    hijriYear: { value: 2, claims: ['ali/marriage-fatimah'] },
    description: {
      value:
        'تزوج علي بن أبي طالب فاطمة الزهراء، فقال له رسول الله صلى الله عليه وسلم: (ما فعلت درع سلحتكها؟) فكانت صداقها.',
      claims: ['ali/marriage-fatimah'],
    },
  },
  people: [
    { person: 'ali-ibn-abi-talib', claims: ['ali/marriage-fatimah'] },
    { person: 'fatimah-bint-muhammad', claims: ['fatimah/marriage-ali'] },
  ],
} satisfies CatalogEvent;

export default marriageOfAliAndFatimah;
