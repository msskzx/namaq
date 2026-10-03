import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Read in full from data/history/batches/abu-talha-al-ansari;
 * every value the entry states is promoted below, and the entry's competing
 * death years and death places stay in the batch as disputed claims.
 */
const abuTalhaAlAnsari = {
  kind: 'PERSON',
  slug: 'abu-talha-al-ansari',
  name: 'أبو طلحة الأنصاري',
  nameTransliterated: 'Abu Talha al-Ansari',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['abu-talha-al-ansari-siyar5/sex'] },
    fullName: {
      value: 'زيد بن سهل بن الأسود بن حرام بن عمرو بن زيد مناة بن عدي بن عمرو بن مالك بن النجار الأنصاري الخزرجي النجاري',
      claims: ['abu-talha-al-ansari-siyar5/full-name'],
    },
    kunya: { value: 'أَبُو طَلْحَةَ', claims: ['abu-talha-al-ansari-siyar5/kunya'] },
    appearance: {
      value: 'كَانَ جَلْداً، صَيِّتاً، آدَمَ، مَرْبُوْعاً، لاَ يُغَيِّرُ شَيْبَهُ.',
      claims: ['abu-talha-al-ansari-siyar5/appearance'],
    },
    virtues: {
      value:
        'صَوْتُ أَبِي طَلْحَةَ فِي الجَيْشِ خَيْرٌ مِنْ فِئَةٍ نَفْسِي لِنَفْسِكَ الفِدَاءُ، وَوَجْهِي لِوَجْهِكَ الوِقَاءُ كَانَ يَرْمِي بَيْنَ يَدَيْ رَسُوْلِ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- يَوْمَ أُحُدٍ وَكَانَ يَدْفَعُ صَدْرَ رَسُوْلِ اللهِ بِيَدِهِ فَقَتَلَ أَبُو طَلْحَةَ يَوْمَئِذٍ عِشْرِيْنَ رَجُلاً، وَأَخَذَ أَسْلاَبَهُمْ إِنَّ أَحَبَّ أَمْوَالِي إِلَيَّ بَيْرُحَاءُ، وَإِنَّهَا صَدَقَةٌ للهِ سَرَدَ الصَّوْمَ بَعْدَ النَّبِيِّ',
      claims: ['abu-talha-al-ansari-siyar5/virtues'],
    },
    deathYearHijri: { value: '34', claims: ['abu-talha-al-ansari-siyar5/death-year'] },
    placeOfDeathArabic: { value: 'المَدِيْنَةِ', claims: ['abu-talha-al-ansari-siyar5/death-place'] },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['abu-talha-al-ansari-siyar5/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'sahl-ibn-al-aswad',
      claims: ['abu-talha-al-ansari-siyar5/father'],
    },
    {
      type: 'HUSBAND',
      inverse: 'WIFE',
      to: 'umm-sulaym-al-ghumaysa',
      claims: ['abu-talha-al-ansari-siyar5/wife-umm-sulaym'],
    },
  ],
  ayat: [
    // He read {انفروا خفافا وثقالا} as his call to arms. Numbered 9:41 here;
    // the print labels it [التوبة: 42] (see data/history/batches/abu-talha-al-ansari).
    { surah: 9, ayah: 41, claims: ['abu-talha-al-ansari-siyar5/ayah-al-tawbah'] },
  ],
} satisfies CatalogPerson;

export default abuTalhaAlAnsari;
