import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const saeedIbnAlHarith = {
  kind: 'PERSON',
  slug: 'saeed-ibn-al-harith',
  name: 'سعيد بن الحارث',
  nameTransliterated: 'Saeed ibn al-Harith',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'سعيد بن الحارث بن عبد المطلب',
      claims: ['saeed-ibn-al-harith-siyar31/full-name'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'al-harith-ibn-abd-al-muttalib',
      claims: ['saeed-ibn-al-harith-siyar31/father'],
    },
    {
      type: 'PATERNAL_COUSIN',
      inverse: 'PATERNAL_COUSIN',
      to: 'prophet-muhammad',
      claims: ['saeed-ibn-al-harith-siyar31/cousin-of-prophet'],
    },
  ],
} satisfies CatalogPerson;

export default saeedIbnAlHarith;
