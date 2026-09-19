import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Authored from data/history/batches/abdur-rahman-ibn-awf. Arabic is verbatim
 * and vowelled as that edition prints it, joined where a sentence crosses a
 * page break. Rewording parts a value from the passage behind it.
 */
const abdurRahmanIbnAwf = {
  kind: 'PERSON',
  slug: 'abdur-rahman-ibn-awf',
  name: 'عبد الرحمن بن عوف',
  nameTransliterated: 'Abdur Rahman ibn Awf',
  hasProfile: true,

  fields: {
    // The heading breaks the lineage in two, carrying the entry number and the
    // collection marks, and the nisbas arrive a paragraph later. The number and
    // the marks are dropped and the rest joined back into one line.
    fullName: {
      value:
        'عَبْدُ الرَّحْمَنِ بنُ عَوْفِ بنِ عَبْدِ عَوْفِ بنِ عَبْدِ بنِ الحَارِثِ بنِ زُهْرَةَ بنِ كِلاَبِ بنِ مُرَّةَ بنِ كَعْبِ بنِ لُؤَيٍّ، القُرَشِيُّ الزُّهْرِيُّ.',
      claims: ['awf/full-name'],
    },
    kunya: { value: 'أَبُو مُحَمَّدٍ', claims: ['awf/kunya'] },
    // Three reports, none of them contradicting another: Sahla bint Asim gives
    // the face and the hair, al-Waqidi the height and the colouring, Ibn Ishaq
    // what Uhud left. The old seed had him أسمر, which no report here supports.
    appearance: {
      value:
        'كَانَ رَجُلاً طُوَالاً، أَبْيَضَ مُشْرَباً حُمْرَةً، حَسَنَ الوَجْهِ، رَقِيْقَ البَشْرَةِ، لَهُ جُمَّةٌ أَسْفَلَ مِنْ أُذُنَيْهِ، ضَخْمَ الكَتِفَيْنِ، وَكَانَ سَاقِطَ الثَّنِيَّتَيْنِ أَهْتَمَ أَعْرَجَ مِمَّا أُصِيْبَ بِهِ يَوْمَ أُحُدٍ.',
      claims: ['awf/appearance'],
    },
    virtues: {
      value:
        'شَهِدَ لَهُ النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- بِالجَنَّةِ، وَهُوَ مِنْ أَهْلِ بَدْرٍ الَّذِيْنَ قِيْلَ لَهُم: (اعْمَلُوا مَا شِئْتُم) ، وَصَلَّى رَسُوْلُ اللهِ خَلْفَهُ رَكْعَةً مِنَ الصُّبْحِ، وَتَصَدَّقَ بِشَطْرِ مَالِهِ ثُمَّ بِأَرْبَعِيْنَ أَلْفِ دِيْنَارٍ، وَمِنْ أَفْضَلِ أَعْمَالِهِ عَزْلُهُ نَفْسَهُ مِنَ الأَمْرِ وَقْتَ الشُّوْرَى.',
      claims: ['awf/virtues'],
    },
    // al-Mada'ini, al-Haytham ibn Adi and others agree on the year. The entry
    // also has him living seventy-five years and born ten years after عام الفيل,
    // neither of which the model holds as a field.
    deathYearHijri: { value: '32 AH', claims: ['awf/death-year'] },
    // Where al-Mada'ini says he was buried, in Medina.
    placeOfDeathArabic: { value: 'البَقِيْع', claims: ['awf/death-place'] },
  },

  titles: [
    { title: 'the-ten-promised-paradise', claims: ['awf/titles'] },
    { title: 'companion', claims: ['awf/companion-of-prophet'] },
    { title: 'the-six-of-the-shura', claims: ['awf/titles'] },
    // Not in the old seed's list for him: the naming line counts him one of
    // السابقين البدريين.
    { title: 'al-sabiqoon', claims: ['awf/titles'] },
  ],

  ayat: [
    // al-Dhahabi places him among أهل بيعة الرضوان, whom the verse names.
    { surah: 48, ayah: 18, claims: ['awf/ayah-al-fath'] },
    // Qatadah reads the verse against the hypocrites who called his half-estate
    // gift showing off.
    { surah: 9, ayah: 79, claims: ['awf/ayah-al-tawbah'] },
    // Carried from the old seed, which gave him التوبة 100 uncited. The entry
    // calls him one of السابقين but never reaches for this verse.
    { surah: 9, ayah: 100, claims: legacyUnreviewed },
  ],

  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'awf-ibn-abd-awf', claims: ['awf/father'] },
    { type: 'HUSBAND', to: 'umm-kulthum-bint-uqbah', claims: ['awf/wife-umm-kulthum'] },
    { type: 'COMPANION_OF', to: 'prophet-muhammad', claims: ['awf/companion-of-prophet'] },
    // The مؤاخاة, which the entry reports twice and does not reconcile. Anas
    // pairs him with Uthman and al-Dhahabi answers كَذَا هَذَا, which reads as
    // his own doubt; the later account naming Sa'd ibn al-Rabi carries no such
    // mark. Both are held, because the app now records the tie they disagree
    // over, and the Uthman claim is DISPUTED.
    { type: 'PACT_BROTHER', inverse: 'PACT_BROTHER', to: 'saad-ibn-al-rabi', claims: ['awf/muakhat-saad'] },
    { type: 'PACT_BROTHER', inverse: 'PACT_BROTHER', to: 'uthman-ibn-affan', claims: ['awf/muakhat-uthman'] },
  ],
} satisfies CatalogPerson;

export default abdurRahmanIbnAwf;
