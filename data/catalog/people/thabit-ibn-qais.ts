import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Authored from data/history/batches/thabit-ibn-qais, entry 61, the Siyar's
 * own account of him (docs/extraction-checklist.md).
 *
 * The entry never states his sex outright, so `sex` stays on the legacy
 * marker. The nasab runs to the tribal eponym الخَزْرَج, so the chain stops
 * there rather than growing a node per generation, and الأنصاري / الخزرجي
 * moved to `tribalAffiliation` the way the neighbouring batches split a
 * heading's chain from its nisba labels.
 *
 * The muakhah report (Ibn Ishaq: آخى رسول الله بينه وبين عمار) is disputed in
 * the entry's own next sentence, so no PACT_BROTHER edge is declared on it.
 */
const thabitIbnQais = {
  kind: 'PERSON',
  slug: 'thabit-ibn-qais',
  name: 'ثَابِتُ بنُ قَيْسِ',
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
      value: 'أَبُو مُحَمَّدٍ، وَقِيْلَ: أَبُو عَبْدِ الرَّحْمَنِ',
      claims: ['thabit-ibn-qais-siyar61/kunya'],
    },
    tribalAffiliation: {
      value: 'الأَنْصَارِيُّ الخَزْرَجِ',
      claims: ['thabit-ibn-qais-siyar61/tribal-affiliation'],
    },
    placeOfDeathArabic: { value: 'اليَمَامَةِ', claims: ['thabit-ibn-qais-siyar61/death-place'] },
  },
  virtues: [
    {
      value:
        'خَطِيْبُ الأَنْصَارِ، كَانَ مِنْ نُجَبَاءِ أَصْحَابِ مُحَمَّدٍ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- وَلَمْ يَشْهَدْ بَدْراً، شَهِدَ أُحُداً، وَبَيْعَةَ الرُّضْوَانِ. وَكَانَ جَهِيْرَ الصَّوْتِ، خَطِيْباً بَلِيْغاً. خَطَبَ ثَابِتُ بنُ قَيْسٍ مَقْدَمَ رَسُوْلِ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- المَدِيْنَةَ، فَقَالَ: نَمْنَعُكَ مِمَّا نَمْنَعُ مِنْهُ أَنْفُسَنَا وَأَوْلاَدَنَا، فَمَا لَنَا؟ قَالَ: (الجَنَّةُ) . قَالُوا: رَضِيْنَا يَا ثَابِتُ! أَمَا تَرْضَى أَنْ تَعِيْشَ حَمِيْداً، وَتُقْتَلَ شَهِيْداً، وَتَدْخُلَ الجَنَّةَ لَمَّا نَزَلَتْ: {لاَ تَرْفَعُوا أَصْوَاتَكُم فَوْقَ صَوْتِ النَّبِيِّ} الآيَة، [الحُجُرَاتُ: ٢] نِعْمَ الرَّجُلُ ثَابِتُ بنُ قَيْسِ بنِ شَمَّاسٍ فَقَامَ، فَحَمِدَ اللهَ، وَأَبْلَغَ، وَسُرَّ رَسُوْلُ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- وَالمُسْلِمُوْنَ بِمَقَامِهِ كَانَ ثَابِتٌ عَلَى الأَنْصَارِ يَوْمَ اليَمَامَةِ فَقَاتَلَ حَتَّى قُتِلَ',
      claims: ['thabit-ibn-qais-siyar61/virtues'],
    },
  ],

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
      type: 'HUSBAND',
      inverse: 'WIFE',
      to: 'jamilah-bint-abd-allah-ibn-abi',
      claims: ['thabit-ibn-qais-siyar61/wife-jamilah'],
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
