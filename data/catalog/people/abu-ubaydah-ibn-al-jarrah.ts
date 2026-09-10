import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * Authored from data/history/batches/abu-ubaydah-pilot. Arabic is verbatim and
 * vowelled as that edition prints it, joined where a sentence crosses a page
 * break; rewording it would part the value from the passage behind it.
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
    // Shorter than prisma/personSeedData.ts's text, which also drew on 23-p6.
    // The batch cites that passage under the death year, so the dyeing and
    // braids await an appearance claim.
    appearance: {
      value:
        'كَانَ رَجُلاً نَحِيْفاً، مَعْرُوْقَ الوَجْهِ، خَفِيْفَ اللِّحْيَةِ، طُوَالاً، أَحْنَى، أَثْرَمَ الثَّنِيَّتَيْنِ.',
      claims: ['abu-ubaydah/appearance'],
    },
    // No claim is filed under this field, so these are the claims citing the
    // passages the text composes.
    virtues: {
      value:
        'أَحَدُ السَّابِقِيْنَ الأَوَّلِيْنَ، وَمَنْ عَزَمَ الصِّدِّيْقُ عَلَى تَوْلِيَتِهِ الخِلاَفَةَ، وَأَشَارَ بِهِ يَوْمَ السَّقِيْفَةِ. شَهِدَ لَهُ النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- بِالجَنَّةِ، وَسَمَّاهُ: أَمِيْنَ الأُمَّةِ، وَمَنَاقِبُهُ شَهِيْرَةٌ جَمَّةٌ.',
      claims: ['abu-ubaydah/early-islam', 'abu-ubaydah/testified-paradise', 'abu-ubaydah/title-amin-al-ummah'],
    },
    // The entry gives two years and marks 17 as Ibn Aidh alone (انفرد), which
    // is the author preference the version-one policy follows
    // (docs/authoritative-data-workflow-plan.md). Claim death-year-17 stays.
    deathYearHijri: { value: '18 AH', claims: ['abu-ubaydah/death-year-18'] },
    // Not a conflict with the plague-of-amwas claim: that names the epidemic,
    // this the only place the entry states.
    placeOfDeathArabic: { value: 'فِحْل', claims: ['abu-ubaydah/death-place'] },
  },

  titles: [
    { title: 'amin-al-ummah', claims: ['abu-ubaydah/title-amin-al-ummah'] },
    { title: 'companion', claims: ['abu-ubaydah/companion-of-prophet'] },
    { title: 'al-sabiqoon', claims: ['abu-ubaydah/early-islam'] },
    // Rests on the testimony of paradise; this entry never enumerates the ten.
    // Sa'id ibn Zayd's entry carries the listing hadith, and its claim joins
    // this one once extracted.
    { title: 'the-ten-promised-paradise', claims: ['abu-ubaydah/testified-paradise'] },
  ],

  relations: [
    { type: 'SON', to: 'abdullah-ibn-al-jarrah', claims: ['abu-ubaydah/full-name'] },
    { type: 'COMPANION_OF', to: 'prophet-muhammad', claims: ['abu-ubaydah/companion-of-prophet'] },
  ],
} satisfies CatalogPerson;

export default abuUbaydahIbnAlJarrah;
