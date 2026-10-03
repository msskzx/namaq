import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// data/history/batches/jabr-ibn-atik, entry 7.
const jabrIbnAtik = {
  kind: 'PERSON',
  slug: 'jabr-ibn-atik',
  name: 'جَبْرُ بنُ عَتِيْكِ',
  nameTransliterated: 'Jabr ibn Atik',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'جَبْرُ بنُ عَتِيْكِ بنِ قَيْسِ بنِ هَيْشَةَ بنِ الحَارِثِ بنِ أُمَيَّةَ بنِ مُعَاوِيَةَ بنِ مَالِكِ بنِ عَوْفِ بنِ عَمْرِو بنِ عَوْفٍ الأَنْصَارِيُّ',
      claims: ['jabr-ibn-atik-siyar/full-name'],
    },
    kunya: { value: 'أَبُو عَبْدِ اللهِ', claims: ['jabr-ibn-atik-siyar/kunya'] },
    virtues: {
      value:
        'بَدْرِيٌّ كَبِيْرٌ. شَهِدَ بَدْراً وَالمَشَاهِدَ، وَكَانَتْ إِلَيْهِ رَايَةُ بَنِي مُعَاوِيَةَ بنِ مَالِكٍ يَوْمَ الفَتْحِ',
      claims: ['jabr-ibn-atik-siyar/virtues'],
    },
    deathYearHijri: {
      value: '42',
      claims: ['jabr-ibn-atik-siyar/death-year-42'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'atik-ibn-qais-al-ansari', claims: ['jabr-ibn-atik-siyar/father'] },
    { type: 'FATHER', inverse: 'SON', to: 'atik-ibn-jabr', claims: ['jabr-ibn-atik-siyar/child-atik'] },
    { type: 'FATHER', inverse: 'SON', to: 'abdullah-ibn-jabr', claims: ['jabr-ibn-atik-siyar/child-abdullah'] },
    {
      type: 'FATHER',
      inverse: 'DAUGHTER',
      to: 'umm-thabit-bint-jabr',
      claims: ['jabr-ibn-atik-siyar/child-umm-thabit'],
    },
    {
      type: 'PACT_BROTHER',
      inverse: 'PACT_BROTHER',
      to: 'khabbab-ibn-al-aratt',
      claims: ['jabr-ibn-atik-siyar/pact-brother-khabbab'],
    },
    {
      type: 'PATERNAL_UNCLE',
      inverse: 'PATERNAL_NEPHEW',
      to: 'al-harith-ibn-qais-ibn-hayshah-al-awsi',
      claims: ['jabr-ibn-atik-siyar/paternal-uncle-harith'],
    },
  ],
} satisfies CatalogPerson;

export default jabrIbnAtik;
