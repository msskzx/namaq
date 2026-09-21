import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Authored from data/history/batches/saad-ibn-abi-waqqas. Arabic is verbatim
 * and vowelled as that edition prints it, joined where a sentence crosses a
 * page break. Rewording parts a value from the passage behind it.
 */
const saadIbnAbiWaqqas = {
  kind: 'PERSON',
  slug: 'saad-ibn-abi-waqqas',
  name: 'سعد بن أبي وقاص',
  nameTransliterated: 'Saad ibn Abi Waqqas',
  hasProfile: true,

  fields: {
    // The heading gives أبو وقاص by kunya and the next paragraph unpacks it to
    // مالك بن أهيب, so the two are joined; the nisbas arrive a page later.
    fullName: {
      value:
        'سَعْدُ بنُ أَبِي وَقَّاصٍ مَالِكِ بنِ أُهَيْبِ بنِ عَبْدِ مَنَافِ بنِ زُهْرَةَ بنِ كِلاَبِ بنِ مُرَّةَ بنِ كَعْبِ بنِ لُؤَيٍّ، القُرَشِيُّ الزُّهْرِيُّ المَكِّيُّ.',
      claims: ['saad/full-name'],
    },
    kunya: { value: 'أَبُو إِسْحَاقَ', claims: ['saad/kunya'] },
    // Two descriptions that do not agree. His daughter Aisha has him short,
    // Ismail ibn Muhammad ibn Sa'd has him tall. Her account is the one the
    // value takes, since Ibn Mandah reports the same build independently at
    // 96-p11; the other is kept as its own DISPUTED claim.
    appearance: {
      value:
        'كَانَ رَجُلاً قَصِيْراً، دَحْدَاحاً، غَلِيْظاً، ذَا هَامَةٍ، شَثْنَ الأَصَابِعِ، أَشْعَرَ، يَخْضِبُ بِالسَّوَادِ.',
      claims: ['saad/appearance'],
    },
    virtues: {
      value:
        'جَمَعَ لَهُ رَسُوْلُ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- أَبَوَيْهِ يَوْمَ أُحُدٍ، وَقَالَ فِيْهِ: (هَذَا خَالِي، فَلْيُرِنِي امْرُؤٌ خَالَهُ) ، وَدَعَا لَهُ: (اللَّهُمَّ اسْتَجِبْ لِسَعْدٍ إِذَا دَعَاكَ) ، وَكَانَ فَتْحُ العِرَاقِ عَلَى يَدَيْهِ، وَهُوَ مُقَدَّمُ الجُيُوْشِ يَوْمَ وَقْعَةِ القَادِسِيَّةِ. وقال: لقد مكثت سبعة أيام وإني لثلث الإسلام.',
      claims: ['saad/virtues', 'saad/thulth-al-islam'],
    },
    // Four years are reported. 55 is what al-Mada'ini, Abu Ubaydah and a group
    // give, and the burial account agrees, so the field takes it; 56, 57 and 58
    // are held as their own DISPUTED claim rather than dropped.
    deathYearHijri: { value: '55 AH', claims: ['saad/death-year'] },
    placeOfDeathArabic: { value: 'العَقِيْق', claims: ['saad/death-place'] },
  },

  titles: [
    { title: 'al-sabiqoon', claims: ['saad/al-sabiqoon-eight'] },
    { title: 'the-ten-promised-paradise', claims: ['saad/titles'] },
    { title: 'companion', claims: ['saad/companion-of-prophet'] },
    { title: 'the-six-of-the-shura', claims: ['saad/titles'] },
    // The seed gave him this one. He claims it himself: أول المسلمين رمى
    // المشركين بسهم.
    { title: 'awwal-rami', claims: ['saad/titles'] },
    // Not in the seed's list for him: the naming line counts him among
    // السابقين الأولين.
    { title: 'al-sabiqoon', claims: ['saad/titles'] },
  ],

  ayat: [
    // He names himself among the six the verse was revealed about.
    { surah: 6, ayah: 52, claims: ['saad/ayah-al-anam'] },
    // نزلت هذه الآية فيّ, over his mother's hunger strike against his Islam.
    { surah: 29, ayah: 8, claims: ['saad/ayah-al-ankabut'] },
    // Carried from the old seed, which gave him الأنعام 124 uncited. The entry
    // reaches for two other verses and never this one.
    { surah: 6, ayah: 124, claims: legacyUnreviewed },
  ],

  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'malik-ibn-uhayb', claims: ['saad/father'] },
    {
      type: 'MATERNAL_UNCLE',
      inverse: 'MATERNAL_NEPHEW',
      to: 'prophet-muhammad',
      claims: ['saad/maternal-uncle-of-prophet'],
    },
    { type: 'COMPANION_OF', to: 'prophet-muhammad', claims: ['saad/companion-of-prophet'] },
  ],
} satisfies CatalogPerson;

export default saadIbnAbiWaqqas;
