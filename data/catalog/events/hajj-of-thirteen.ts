import type { CatalogEvent } from '@/lib/catalog/types';

// al-Sha'bi gives the year outright, which is why this one carries a hijriYear
// where the Shura beside it does not.
const hajjOfThirteen = {
  kind: 'EVENT',
  slug: 'hajj-of-thirteen',
  name: 'حج عبد الرحمن بن عوف بالمسلمين سنة ثلاث عشرة',
  nameTransliterated: 'The Hajj of 13 AH',
  type: 'OTHER',
  fields: {
    hijriYear: { value: 13, claims: ['awf/hajj-thirteen'] },
    description: {
      value: 'حج عبد الرحمن بن عوف بالمسلمين سنة ثلاث عشرة.',
      claims: ['awf/hajj-thirteen'],
    },
  },
  people: [{ person: 'abdur-rahman-ibn-awf', claims: ['awf/hajj-thirteen'] }],
} satisfies CatalogEvent;

export default hajjOfThirteen;
