import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * Authored from data/history/batches/abu-ubaydah-pilot. Arabic is verbatim and
 * vowelled as that edition prints it, joined where a sentence crosses a page
 * break. Rewording parts a value from the passage behind it.
 */
const abuUbaydahIbnAlJarrah = {
  kind: 'PERSON',
  slug: 'abu-ubaydah-ibn-al-jarrah',
  name: 'أبو عبيدة بن الجراح',
  nameTransliterated: 'Abu Ubaydah ibn al-Jarrah',
  hasProfile: true,

  fields: {
    fullName: {
      value:
        'عَامِرُ بنُ عَبْدِ اللهِ بنِ الجَرَّاحِ بنِ هِلاَلِ بنِ أُهَيْبِ بنِ ضَبَّةَ بنِ الحَارِثِ بنِ فِهْرِ بنِ مَالِكِ بنِ النَّضْرِ بنِ كِنَانَةَ بنِ خُزَيْمَةَ بنِ مُدْرِكَةَ بنِ إِلْيَاسَ بنِ مُضَرَ بنِ نِزَارِ بنِ مَعَدِّ بنِ عَدْنَانَ القُرَشِيُّ، الفِهْرِيُّ، المَكِّيُّ.',
      claims: ['abu-ubaydah/full-name'],
    },
    // Composed from 7-p9 and 23-p6; the latter gives the death year and the
    // dyeing in one sentence, so it backs two fields.
    appearance: {
      value:
        'كَانَ رَجُلاً نَحِيْفاً، مَعْرُوْقَ الوَجْهِ، خَفِيْفَ اللِّحْيَةِ، طُوَالاً، أَحْنَى، أَثْرَمَ الثَّنِيَّتَيْنِ. وَكَانَ يَخْضِبُ بِالحِنَّاءِ وَالكَتَمِ، وَكَانَ لَهُ عَقِيْصَتَانِ.',
      claims: ['abu-ubaydah/appearance'],
    },
    // No claim names this field, so these cite the passages it composes. It runs
    // one passage further: 6-p1 finishes the sentence 5-p5 breaks off, uncited.
    virtues: {
      value:
        'أَحَدُ السَّابِقِيْنَ الأَوَّلِيْنَ، وَمَنْ عَزَمَ الصِّدِّيْقُ عَلَى تَوْلِيَتِهِ الخِلاَفَةَ، وَأَشَارَ بِهِ يَوْمَ السَّقِيْفَةِ؛ لِكَمَالِ أَهْلِيَّتِهِ عِنْدَ أَبِي بَكْرٍ. شَهِدَ لَهُ النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- بِالجَنَّةِ، وَسَمَّاهُ: أَمِيْنَ الأُمَّةِ، وَمَنَاقِبُهُ شَهِيْرَةٌ جَمَّةٌ.',
      claims: ['abu-ubaydah/early-islam', 'abu-ubaydah/testified-paradise', 'abu-ubaydah/title-amin-al-ummah'],
    },
    // Two years given; 17 is marked Ibn Aidh alone (انفرد), so author preference
    // picks 18 (docs/authoritative-data-workflow-plan.md).
    deathYearHijri: { value: '18 AH', claims: ['abu-ubaydah/death-year-18'] },
    // Not a conflict with plague-of-amwas: that names the epidemic, this the place.
    placeOfDeathArabic: { value: 'فِحْل', claims: ['abu-ubaydah/death-place'] },
  },

  titles: [
    { title: 'amin-al-ummah', claims: ['abu-ubaydah/title-amin-al-ummah'] },
    { title: 'companion', claims: ['abu-ubaydah/companion-of-prophet'] },
    { title: 'al-sabiqoon', claims: ['abu-ubaydah/early-islam'] },
    // Rests on the testimony of paradise; this entry never enumerates the ten.
    // Sa'id ibn Zayd's entry carries the listing hadith, to be added with it.
    { title: 'the-ten-promised-paradise', claims: ['abu-ubaydah/testified-paradise'] },
  ],

  relations: [
    { type: 'SON', to: 'abdullah-ibn-al-jarrah', claims: ['abu-ubaydah/full-name'] },
    { type: 'COMPANION_OF', to: 'prophet-muhammad', claims: ['abu-ubaydah/companion-of-prophet'] },
  ],
} satisfies CatalogPerson;

export default abuUbaydahIbnAlJarrah;
