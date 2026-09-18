import { type CatalogPerson } from '@/lib/catalog/types';

/**
 * Authored from data/history/batches/az-zubayr-ibn-al-awwam. Arabic is verbatim
 * and vowelled as that edition prints it, joined where a sentence crosses a
 * page break. Rewording parts a value from the passage behind it.
 */
const azZubayrIbnAlAwwam = {
  kind: 'PERSON',
  slug: 'az-zubayr-ibn-al-awwam',
  name: 'الزبير بن العوام',
  nameTransliterated: 'Al-Zubayr ibn al-Awwam',
  hasProfile: true,

  fields: {
    // The heading carries the entry number and the collection marks, and the
    // lineage runs on past them into the next paragraph; both are dropped.
    fullName: {
      value:
        'الزُّبَيْرُ بنُ العَوَّامِ بنِ خُوَيْلِدِ بنِ أَسَدِ بنِ عَبْدِ العُزَّى ابْنِ قُصَيِّ بنِ كِلاَبِ بنِ مُرَّةَ بنِ كَعْبِ بنِ لُؤَيِّ بنِ غَالِبٍ.',
      claims: ['zubayr/full-name'],
    },
    kunya: { value: 'أَبُو عَبْدِ اللهِ', claims: ['zubayr/kunya'] },
    // Two reports that agree: Urwah adds أشعر to what the first describes, so
    // the value takes both rather than choosing between them.
    appearance: {
      value:
        'كَانَ رَجُلاً طَوِيْلاً، إِذَا رَكِبَ خَطَّتْ رِجْلاهُ الأَرْضَ، وَكَانَ خَفِيْفَ اللِّحْيَةِ وَالعَارِضَيْنِ، أَشْعَرَ.',
      claims: ['zubayr/appearance'],
    },
    virtues: {
      value:
        'حَوَارِيُّ رَسُوْلِ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- وَابْنُ عَمَّتِهِ صَفِيَّةَ بِنْتِ عَبْدِ المُطَّلِبِ، وَأَحَدُ العَشرَةِ المَشْهُوْدِ لَهُم بِالجَنَّةِ، وَأَحَدُ السِّتَّةِ أَهْلِ الشُّوْرَى، وَأَوَّلُ مَنْ سَلَّ سَيْفَهُ فِي سَبِيْلِ اللهِ. قَالَ النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ-: (لِكُلِّ نَبِيٍّ حَوَارِيٌّ، وَحَوَارِيَّ الزُّبَيْرُ) ، وَجَمَعَ لَهُ أَبَوَيْهِ يَوْمَ الخَنْدَقِ.',
      claims: ['zubayr/virtues'],
    },
    // The month is Rajab and the year is not disputed; the age at death is,
    // between 64 and بضع وخمسون, and the model holds neither.
    deathYearHijri: { value: '36 AH', claims: ['zubayr/death-year'] },
    // Where he fell, which the entry places seven farsakhs from Basra. He had
    // already withdrawn from the battle when Ibn Jurmuz caught him.
    placeOfDeathArabic: { value: 'وَادِي السِّبَاعِ', claims: ['zubayr/death-place'] },
  },

  titles: [
    { title: 'the-ten-promised-paradise', claims: ['zubayr/titles'] },
    { title: 'companion', claims: ['zubayr/companion-of-prophet'] },
    { title: 'hawari-al-ummah', claims: ['zubayr/titles'] },
    { title: 'the-six-of-the-shura', claims: ['zubayr/titles'] },
    // Not in the old seed's list for him: the entry adds it in al-Dhahabi's
    // own voice, counting the four among السابقين الأولين.
    { title: 'al-sabiqoon', claims: ['zubayr/titles'] },
  ],

  ayat: [
    // Aisha names him and Abu Bakr as two of those the verse describes, which
    // is the same verse the old seed carried for him, now with its evidence.
    { surah: 3, ayah: 172, claims: ['zubayr/ayah-al-imran'] },
  ],

  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-awwam-ibn-khuwaylid', claims: ['zubayr/father'] },
    { type: 'SON', inverse: 'MOTHER', to: 'safiyyah-bint-abd-al-muttalib', claims: ['zubayr/mother'] },
    { type: 'HUSBAND', to: 'asma-bint-abi-bakr', claims: ['zubayr/wife-asma'] },
    {
      type: 'PATERNAL_COUSIN',
      inverse: 'PATERNAL_COUSIN',
      to: 'prophet-muhammad',
      claims: ['zubayr/cousin-of-prophet'],
    },
    { type: 'COMPANION_OF', to: 'prophet-muhammad', claims: ['zubayr/companion-of-prophet'] },
  ],
} satisfies CatalogPerson;

export default azZubayrIbnAlAwwam;
