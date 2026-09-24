import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Authored from data/history/batches/saeed-ibn-zaid. Arabic is verbatim and
 * vowelled as that edition prints it.
 */
const saeedIbnZaid = {
  kind: 'PERSON',
  slug: 'saeed-ibn-zaid',
  name: 'سعيد بن زيد',
  nameTransliterated: 'Sa\'id ibn Zayd',
  hasProfile: true,

  fields: {
    fullName: {
      value:
        'سَعِيْدُ بنُ زَيْدِ بنِ عَمْرِو بنِ نُفَيْلٍ، ابْنِ عَبْدِ العُزَّى بنِ رِيَاحِ بنِ قُرْطِ بنِ رَزَاحِ بنِ عَدِيِّ بنِ كَعْبِ بنِ لُؤَيِّ بنِ غَالِبٍ، أَبُو الأَعْوَرِ، القُرَشِيُّ، العَدَوِيُّ.',
      claims: ['saeed/full-name'],
    },
    kunya: { value: 'أَبُو الأَعْوَرِ', claims: ['saeed/kunya'] },
    // The seed's wording (قصير، أسمر اللون، خفيف اللحية) is not in this entry.
    // Al-Waqidi's is, and replaces it.
    appearance: { value: 'كَانَ سَعِيْدٌ رَجُلاً آدَمَ، طَوِيْلاً، أَشْعَرَ.', claims: ['saeed/appearance'] },
    virtues: {
      value: 'شَهِدَ سَعِيْدٌ أُحُداً، وَالخَنْدَقَ، وَالحُدَيْبِيَةَ، وَالمَشَاهِدَ.',
      claims: ['saeed/mashahid'],
    },
    // Al-Waqidi's 51 AH agrees with the burial account naming Sa'd ibn Abi
    // Waqqas and Ibn Umar at the grave; Ubaydullah ibn Sa'd al-Zuhri's 52 is
    // its own DISPUTED claim.
    deathYearHijri: { value: '51 AH', claims: ['saeed/death-year'] },
    // Al-Haytham ibn Adi's Kufa is the lone dissent, its own DISPUTED claim.
    placeOfDeathArabic: { value: 'العَقِيْق', claims: ['saeed/death-place'] },
  },

  titles: [
    { title: 'the-ten-promised-paradise', claims: ['saeed/titles'] },
    { title: 'al-sabiqoon', claims: ['saeed/titles'] },
    { title: 'companion', claims: ['saeed/companion-of-prophet'] },
  ],

  ayat: [
    // Carried from the old seed, which gave him al-Tawbah 100 uncited. The
    // entry never names this verse for him; it addresses السابقون الأولون
    // collectively rather than singling him out.
    { surah: 9, ayah: 100, claims: legacyUnreviewed },
  ],

  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'zayd-ibn-amr-ibn-nufayl', claims: ['saeed/father'] },
    { type: 'COMPANION_OF', to: 'prophet-muhammad', claims: ['saeed/companion-of-prophet'] },
  ],
} satisfies CatalogPerson;

export default saeedIbnZaid;
