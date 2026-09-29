import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/thabit-ibn-qais, entry 61 (docs/extraction-checklist.md).
const thabitIbnQais = {
  kind: 'PERSON',
  slug: 'thabit-ibn-qais',
  name: 'ثابت بن قيس',
  nameTransliterated: 'Thabit ibn Qais',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value:
        'ثابت بن قيس بن شماس بن زهير بن مالك بن امرئ القيس بن مالك الأغر بن ثعلبة بن كعب بن الخزرج بن الحارث بن الخزرج',
      claims: ['thabit-ibn-qais-siyar61/full-name'],
    },
    kunya: {
      value: 'أبو محمد، وقيل: أبو عبد الرحمن',
      claims: ['thabit-ibn-qais-siyar61/kunya'],
    },
    tribalAffiliation: {
      value: 'الأنصاري، الخزرجي',
      claims: ['thabit-ibn-qais-siyar61/tribal-affiliation'],
    },
    virtues: {
      value:
        'خَطِيْبُ الأَنْصَارِ، جَهِيْرُ الصَّوْتِ، خَطِيْبٌ بَلِيْغٌ. خَطَبَ مَقْدَمَ رَسُوْلِ اللهِ المَدِيْنَةَ: نَمْنَعُكَ مِمَّا نَمْنَعُ مِنْهُ أَنْفُسَنَا وَأَوْلاَدَنَا، فَمَا لَنَا؟ قَالَ: الجَنَّةُ، قَالُوا: رَضِيْنَا. وَقَالَ لَهُ: أَمَا تَرْضَى أَنْ تَعِيْشَ حَمِيْداً، وَتُقْتَلَ شَهِيْداً، وَتَدْخُلَ الجَنَّةَ. وَلَمَّا نَزَلَتْ: لاَ تَرْفَعُوا أَصْوَاتَكُم فَوْقَ صَوْتِ النَّبِيِّ، قَعَدَ فِي بَيْتِهِ، فَقَالَ: بَلْ هُوَ مِنْ أَهْلِ الجَنَّةِ. وَقَالَ: نِعْمَ الرَّجُلُ ثَابِتُ بنُ قَيْسِ بنِ شَمَّاسٍ. وَأَجَابَ خَطِيْبَ وَفْدِ تَمِيْمٍ، فَسُرَّ بِمَقَامِهِ رَسُوْلُ اللهِ وَالمُسْلِمُوْنَ. وَكَانَ عَلَى الأَنْصَارِ يَوْمَ اليَمَامَةِ، فَقَاتَلَ حَتَّى قُتِلَ.',
      claims: ['thabit-ibn-qais-siyar61/virtues'],
    },
    placeOfDeathArabic: { value: 'اليمامة', claims: ['thabit-ibn-qais-siyar61/death-place'] },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['thabit-ibn-qais-siyar61/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'qais-ibn-shammas',
      claims: ['thabit-ibn-qais-siyar61/father'],
    },
    {
      type: 'HALF_BROTHER',
      inverse: 'HALF_BROTHER',
      to: 'abdullah-ibn-rawahah',
      claims: ['thabit-ibn-qais-siyar61/half-brother-abdullah'],
    },
  ],
} satisfies CatalogPerson;

export default thabitIbnQais;
