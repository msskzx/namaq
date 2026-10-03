import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/abu-abs, entry 21, immediately after
// Mistah ibn Uthathah. The heading's brotherhood pairing (with Khunays ibn
// Hudhafah al-Sahmi) stays unclaimed: that person has no graph node yet.
const abuAbs = {
  kind: 'PERSON',
  slug: 'abu-abs',
  name: 'أبو عبس',
  nameTransliterated: 'Abu Abs',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'أَبُو عَبْسٍ بنُ جَبْرِ بنِ عَمْرٍو الأَوْسِيُّ بنِ زَيْدِ بنِ جُشَمَ بنِ حَارِثَةَ بنِ الحَارِثِ الأَوْسِيُّ. وَاسْمُهُ: عَبْدُ الرَّحْمَنِ',
      claims: ['abu-abs-siyar21/full-name'],
    },
    kunya: { value: 'أَبُو عَبْسٍ', claims: ['abu-abs-siyar21/kunya'] },
    deathYearHijri: { value: '34', claims: ['abu-abs-siyar21/death-year'] },
    placeOfDeathArabic: { value: 'المَدِيْنَةِ', claims: ['abu-abs-siyar21/death-place'] },
  },
  titles: [
    // Carried from the retired seed. البدري is modeled as the Badr
    // PARTICIPATED_IN relation below rather than repeated as a title.
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'jabr-ibn-amr', claims: ['abu-abs-siyar21/full-name'] },
  ],
} satisfies CatalogPerson;

export default abuAbs;
