import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Authored from data/history/batches/talhah-ibn-ubaydullah. Arabic is verbatim
 * and vowelled as that edition prints it, joined where a sentence crosses a
 * page break. Rewording parts a value from the passage behind it.
 */
const talhahIbnUbaydullah = {
  kind: 'PERSON',
  slug: 'talhah-ibn-ubaydullah',
  name: 'طلحة بن عبيد الله',
  nameTransliterated: 'Talhah ibn Ubaydullah',
  hasProfile: true,

  fields: {
    // The heading carries the entry number and the collection marks, and the
    // lineage runs on past them into the next paragraph; both are dropped, and
    // what is left is the name as the edition prints it.
    fullName: {
      value:
        'طَلْحَةُ بنُ عُبَيْدِ اللهِ بنِ عُثْمَانَ بنِ عَمْرٍو التَّيْمِيُّ ابْنِ كَعْبِ بنِ سَعْدِ بنِ تَيْمِ بنِ مُرَّةَ بنِ كَعْبِ بنِ لُؤَيِّ بنِ غَالِبِ بنِ فِهْرِ بنِ مَالِكِ بنِ النَّضْرِ بنِ كِنَانَةَ القُرَشِيُّ، التَّيْمِيُّ، المَكِّيُّ، أَبُو مُحَمَّدٍ.',
      claims: ['talhah/full-name'],
    },
    // A name, not a title: the entry prints it in the naming line and the
    // people in it address him by it (ADR 0014).
    kunya: { value: 'أَبُو مُحَمَّدٍ', claims: ['talhah/kunya'] },
    // Two descriptions that disagree over his complexion, carried on one
    // disputed claim. Ibn Mandah comes first in the entry and the author
    // prefers neither, so the value follows source order and keeps both.
    appearance: {
      value:
        'كَانَ رَجُلاً آَدَمَ، كَثِيْرَ الشَّعْرِ، لَيْسَ بِالجَعْدِ القَطَطِ، وَلاَ بِالسَّبْطِ، حَسَنَ الوَجْهِ، إِذَا مَشَى أَسْرَعَ، وَلاَ يُغَيِّرُ شَعْرَهُ.',
      claims: ['talhah/appearance'],
    },
    virtues: {
      value:
        'أَحَدُ العَشَرَةِ المَشْهُوْدِ لَهُم بِالجَنَّةِ، وَمِمَّنْ سَبَقَ إِلَى الإِسْلاَمِ. وَقَى النَّبِيَّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- بِيَدِهِ يَوْمَ أُحُدٍ حَتَّى شُلَّتْ، وَقَالَ فِيْهِ: (مَنْ أَرَادَ أَنْ يَنْظُرَ إِلَى شَهِيْدٍ يَمْشِي عَلَى رِجْلَيْهِ، فَلْيَنْظُرْ إِلَى طَلْحَةَ بنِ عُبَيْدِ اللهِ) ، وَسَمَّاهُ: طَلْحَةَ الفَيَّاضَ. وحضر سوق بصرى فأخبره راهب بخروج أحمد وقال: فإياك أن تسبق إليه، فأسرع إلى مكة فأسلم على يد أبي بكر.',
      claims: ['talhah/virtues', 'talhah/islam-rahib-busra'],
    },
    // The month is disputed between Jumada al-Akhirah and Rajab; the year is
    // not, and the year is what the model holds.
    deathYearHijri: { value: '36 AH', claims: ['talhah/death-year'] },
  },

  titles: [
    { title: 'al-sabiqoon', claims: ['talhah/al-sabiqoon-eight'] },
    // Shared with Abu Bakr: one rope, one name.
    { title: 'al-qarinayn', claims: ['talhah/al-qarinayn'] },
    { title: 'the-ten-promised-paradise', claims: ['talhah/titles'] },
    { title: 'companion', claims: ['talhah/companion-of-prophet'] },
    { title: 'al-sabiqoon', claims: ['talhah/titles'] },
    // The entry never places him among the six, so the seed's assignment keeps
    // its marker rather than borrowing evidence from the rest of the entry.
    { title: 'the-six-of-the-shura', claims: legacyUnreviewed },
  ],

  ayat: [
    // The Prophet names him among من قضى نحبه, the phrase of al-Ahzab 23. The
    // entry never says the verse was revealed about him, and the claim's
    // assertion says only what it does.
    { surah: 33, ayah: 23, claims: ['talhah/qada-nahbahu'] },
    // Carried from the retired seed, which read this verse as his. The entry
    // never quotes it, so its evidence is owed.
    { surah: 3, ayah: 172, claims: legacyUnreviewed },
  ],

  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'ubaydullah-ibn-uthman', claims: ['talhah/father'] },
    { type: 'COMPANION_OF', to: 'prophet-muhammad', claims: ['talhah/companion-of-prophet'] },
  ],
} satisfies CatalogPerson;

export default talhahIbnUbaydullah;
