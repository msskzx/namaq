import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/tulayhah-ibn-khuwaylid, entry 62. The
// entry never states his sex outright, so it stays on the legacy marker.
const tulayhahIbnKhuwaylid = {
  kind: 'PERSON',
  slug: 'tulayhah-ibn-khuwaylid',
  name: 'طليحة بن خويلد',
  nameTransliterated: 'Tulayhah ibn Khuwaylid',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'طليحة بن خويلد بن نوفل الأسدي',
      claims: ['tulayhah-ibn-khuwaylid-siyar62/full-name'],
    },
    virtues: {
      value:
        'البطل الكرار ومن يضرب بشجاعته المثل. كتب عمر إلى سعد بن أبي وقاص: أن شاور طليحة في أمر الحرب ولا توله شيئا. قال محمد بن سعد: كان طليحة يعد بألف فارس لشجاعته وشدته. أبلى يوم نهاوند.',
      claims: ['tulayhah-ibn-khuwaylid-siyar62/virtues'],
    },
    placeOfDeathArabic: { value: 'نهاوند', claims: ['tulayhah-ibn-khuwaylid-siyar62/death-place'] },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['tulayhah-ibn-khuwaylid-siyar62/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'khuwaylid-ibn-nawfal',
      claims: ['tulayhah-ibn-khuwaylid-siyar62/father'],
    },
  ],
} satisfies CatalogPerson;

export default tulayhahIbnKhuwaylid;
