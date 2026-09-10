import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * Every value here comes from al-Dhahabi's entry in Siyar A'lam al-Nubala',
 * extracted as data/history/batches/abu-ubaydah-pilot. Arabic is verbatim and
 * vowelled as the edition prints it; a sentence running across a page break is
 * joined and nothing is reworded.
 *
 * Values the entry does not support are deliberately absent, so this module is
 * smaller than prisma/personSeedData.ts's record of the same person. Left
 * behind: his ayah reference, which no claim covers and this type does not yet
 * model, and his nine battle participations, which belong to the battle
 * records rather than here. Of those nine only Badr, Uhud, Damascus and
 * Yarmuk have claims in this entry at all.
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
    // Passage 7-p9 only. The dormant seed also carried the henna-dyeing and
    // braids from 23-p6, which the batch cites under the death-year claim
    // rather than an appearance one, so that sentence waits for a claim of
    // its own.
    appearance: {
      value:
        'كَانَ رَجُلاً نَحِيْفاً، مَعْرُوْقَ الوَجْهِ، خَفِيْفَ اللِّحْيَةِ، طُوَالاً، أَحْنَى، أَثْرَمَ الثَّنِيَّتَيْنِ.',
      claims: ['abu-ubaydah/appearance'],
    },
    // Composed from 5-p5 and 6-p3, joined across the page break. No single
    // claim carries field `virtues`, so it names the claims that cite those
    // two passages.
    virtues: {
      value:
        'أَحَدُ السَّابِقِيْنَ الأَوَّلِيْنَ، وَمَنْ عَزَمَ الصِّدِّيْقُ عَلَى تَوْلِيَتِهِ الخِلاَفَةَ، وَأَشَارَ بِهِ يَوْمَ السَّقِيْفَةِ. شَهِدَ لَهُ النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- بِالجَنَّةِ، وَسَمَّاهُ: أَمِيْنَ الأُمَّةِ، وَمَنَاقِبُهُ شَهِيْرَةٌ جَمَّةٌ.',
      claims: ['abu-ubaydah/early-islam', 'abu-ubaydah/testified-paradise', 'abu-ubaydah/title-amin-al-ummah'],
    },
    // The entry gives two years. al-Dhahabi reports 18 from al-Fallas with a
    // group agreeing, and marks the 17 report as Ibn Aidh alone (انفرد).
    // That is the author's own preference, and source order gives the same
    // answer. The competing claim stays recorded in the batch either way.
    deathYearHijri: { value: '18 AH', claims: ['abu-ubaydah/death-year-18'] },
    // Fihl, near Baysan. The entry also places his death in the plague of
    // Amwas; the two are not exclusive, and only this passage states a place.
    placeOfDeathArabic: { value: 'فِحْل', claims: ['abu-ubaydah/death-place'] },
  },

  titles: [
    { title: 'amin-al-ummah', claims: ['abu-ubaydah/title-amin-al-ummah'] },
    { title: 'companion', claims: ['abu-ubaydah/companion-of-prophet'] },
    { title: 'al-sabiqoon', claims: ['abu-ubaydah/early-islam'] },
    // This entry records the Prophet testifying paradise for him, but never
    // enumerates the ten. The listing hadith is Sa'id ibn Zayd's, in his own
    // entry later in the same work, and its claim key joins this one when
    // that entry is extracted.
    { title: 'the-ten-promised-paradise', claims: ['abu-ubaydah/testified-paradise'] },
  ],

  relations: [
    // The nasab in 5-p3 and 5-p4 opens with عَامِرُ بنُ عَبْدِ اللهِ, which is
    // what names his father. The reciprocal FATHER edge is derived, not
    // declared.
    { type: 'SON', to: 'abdullah-ibn-al-jarrah', claims: ['abu-ubaydah/full-name'] },
    { type: 'COMPANION_OF', to: 'prophet-muhammad', claims: ['abu-ubaydah/companion-of-prophet'] },
  ],
} satisfies CatalogPerson;

export default abuUbaydahIbnAlJarrah;
