import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/khawlah-bint-hakim, entry 38 in
// سير أعلام النبلاء. The entry does not call her أم المؤمنين or صحابية
// outright — see the batch's summary.md for that scope call.
const khawlahBintHakim = {
  kind: 'PERSON',
  slug: 'khawlah-bint-hakim',
  name: 'خَوْلَةُ بِنْتُ حَكِيْمٍ',
  nameTransliterated: 'Khawlah bint Hakim',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: ['khawlah-bint-hakim-siyar38/sex'] },
    fullName: {
      value: 'خَوْلَةُ بِنْتُ حَكِيْمٍ',
      claims: ['khawlah-bint-hakim-siyar38/full-name'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    {
      type: 'DAUGHTER',
      inverse: 'FATHER',
      to: 'hakim-abu-khawlah',
      claims: ['khawlah-bint-hakim-siyar38/full-name'],
    },
    {
      type: 'WIFE',
      inverse: 'HUSBAND',
      to: 'prophet-muhammad',
      claims: ['khawlah-bint-hakim-siyar38/wife-of-prophet'],
    },
  ],
} satisfies CatalogPerson;

export default khawlahBintHakim;
