import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Asked for the worst thing the idolaters did to the Prophet ﷺ, Abd Allah ibn Amr ibn al-As told of Uqbah ibn Abi Mu'ayt
 * twisting his garment round his neck as he prayed in the Hijr of the Ka'bah, until Abu Bakr pushed him off with
 * {أتقتلون رجلا أن يقول ربي الله} (Ghafir 28). Told from Sahih al-Bukhari 3856 (Manaqib al-Ansar), whole, with al-Bukhari's
 * notes on who was asked: Abd Allah ibn Amr in Ibn Ishaq's chain, Amr ibn al-As in Abdah's and Muhammad ibn Amr's.
 */
const abuBakrDefendsTheProphet = {
  kind: 'EVENT',
  slug: 'abu-bakr-defends-the-prophet',
  name: "أبو بكر يدفع عقبة عن النبي ﷺ",
  nameTransliterated: "Abu Bakr pushes Uqbah away from the Prophet",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abu-bakr-as-siddiq' }, { person: 'prophet-muhammad' }, { person: 'uqba-ibn-abi-muayt' }, { person: 'abdullah-ibn-amr-ibn-al-as' }],
  ayat: [
    {
      kind: 'RECITED',
      from: '40:28',
      to: '40:28',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 3856, url: 'https://sunnah.com/bukhari:3856', quote: "فَأَقْبَلَ أَبُو بَكْرٍ حَتَّى أَخَذَ بِمَنْكِبِهِ، وَدَفَعَهُ عَنِ النَّبِيِّ ﷺ قَالَ: ﴿أَتَقْتُلُونَ رَجُلا أَنْ يَقُولَ رَبِّيَ اللهُ﴾ الْآيَةَ." }],
    },
  ],
  reports: [
    {
      isnad: "حَدَّثَنَا عَيَّاشُ بْنُ الْوَلِيدِ: حَدَّثَنَا الْوَلِيدُ بْنُ مُسْلِمٍ: حَدَّثَنِي الْأَوْزَاعِيُّ: حَدَّثَنِي يَحْيَى بْنُ أَبِي كَثِيرٍ، عَنْ مُحَمَّدِ بْنِ إِبْرَاهِيمَ التَّيْمِيِّ قَالَ: حَدَّثَنِي عُرْوَةُ بْنُ الزُّبَيْرِ",
      source: { slug: 'sahih-al-bukhari', hadith: 3856, url: 'https://sunnah.com/bukhari:3856' },
      moments: [
        { title: "«أشد شيء صنعه المشركون»", text: "قَالَ: سَأَلْتُ ابْنَ عَمْرِو بْنِ الْعَاصِ: «أَخْبِرْنِي بِأَشَدِّ شَيْءٍ صَنَعَهُ الْمُشْرِكُونَ بِالنَّبِيِّ ﷺ،", people: ['abdullah-ibn-amr-ibn-al-as', 'prophet-muhammad'] },
        { title: "عقبة يخنقه بثوبه", text: "قَالَ: بَيْنَا النَّبِيُّ ﷺ يُصَلِّي فِي حِجْرِ الْكَعْبَةِ، إِذْ أَقْبَلَ عُقْبَةُ بْنُ أَبِي مُعَيْطٍ، فَوَضَعَ ثَوْبَهُ فِي عُنُقِهِ، فَخَنَقَهُ خَنْقًا شَدِيدًا،", people: ['prophet-muhammad', 'uqba-ibn-abi-muayt'] },
        { title: "«أتقتلون رجلا أن يقول ربي الله»", text: "فَأَقْبَلَ أَبُو بَكْرٍ حَتَّى أَخَذَ بِمَنْكِبِهِ، وَدَفَعَهُ عَنِ النَّبِيِّ ﷺ قَالَ: ﴿أَتَقْتُلُونَ رَجُلا أَنْ يَقُولَ رَبِّيَ اللهُ﴾ الْآيَةَ.»", people: ['abu-bakr-as-siddiq', 'prophet-muhammad', 'uqba-ibn-abi-muayt'] },
        { title: "من سُئل عن ذلك", text: "تَابَعَهُ ابْنُ إِسْحَاقَ: حَدَّثَنِي يَحْيَى بْنُ عُرْوَةَ، عَنْ عُرْوَةَ، قُلْتُ لِعَبْدِ اللهِ بْنِ عَمْرٍو. وَقَالَ عَبْدَةُ، عَنْ هِشَامٍ، عَنْ أَبِيهِ: قِيلَ لِعَمْرِو بْنِ الْعَاصِ. وَقَالَ مُحَمَّدُ بْنُ عَمْرٍو، عَنْ أَبِي سَلَمَةَ: حَدَّثَنِي عَمْرُو بْنُ الْعَاصِ.", people: ['abdullah-ibn-amr-ibn-al-as', 'amr-ibn-al-as'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abuBakrDefendsTheProphet;
