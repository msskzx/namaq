import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const abuDujanahAlAnsari = {
  kind: 'PERSON',
  slug: 'abu-dujanah-al-ansari',
  name: 'أبو دجانة الأنصاري',
  nameTransliterated: 'Abu Dujanah al-Ansari',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'سماك بن خرشة بن لوذان بن عبد ود بن زيد الأنصاري الساعدي',
      claims: legacyUnreviewed,
    },
    kunya: {
      value: 'أَبُو دُجَانَةَ',
      claims: ['abu-dujanah-al-ansari-siyar39/kunya'],
    },
    virtues: {
      value:
        'وَكَانَ سَيْفُ أَبِي دُجَانَةَ غَيْرَ ذَمِيْمٍ. فَأَخَذَهُ بِذَلِكَ الشَّرْطِ. خَرَجَ بِسَيْفِهِ مُصْلَتاً وَهُوَ يَتَبَخْتَرُ، مَا عَلَيْهِ إِلاَّ قَمِيْصٌ وَعِمَامَةٌ حَمْرَاءُ قَدْ عَصَبَ بِهَا رَأْسَهُ، وَإِنَّهُ لَيَرْتَجِزُ لَقَدْ رَأَيْتُنِي يَوْمَ أُحُدٍ وَمَا فِي الأَرْضِ قُرْبِي مَخْلُوْقٌ غَيْرَ جِبْرِيْلَ عَنْ يَمِيْنِي وَسِمَاكُ بنُ خَرَشَةَ أَبُو دُجَانَةَ سَاكِتٌ لاَ يَنْطِقُ رَمَى أَبُو دُجَانَةَ بِنَفْسِهِ يَوْمَ اليَمَامَةِ إِلَى دَاخِلِ الحَدِيْقَةِ، فَانْكَسَرَتْ رِجْلُهُ، فَقَاتَلَ وَهُوَ مَكْسُوْرُ الرِّجْلِ حَتَّى قُتِلَ',
      claims: [
        'abu-dujanah-al-ansari-siyar39/virtues-sword',
        'abu-dujanah-al-ansari-siyar39/virtues-uhud',
        'abu-dujanah-al-ansari-siyar39/virtues-yamamah',
        'abu-dujanah-al-ansari-siyar39/virtues-silence',
        'abu-dujanah-al-ansari-siyar39/virtues-prophet-uhud',
      ],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: ['abu-dujanah-al-ansari-siyar39/titles'] },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'khirashah-ibn-lawdhan', claims: ['abu-dujanah-al-ansari-siyar39/father'] },
  ],
} satisfies CatalogPerson;

export default abuDujanahAlAnsari;
