import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Ali sent a piece of unrefined gold from Yemen and the Prophet ﷺ divided it among four men; when a Companion said they had
 * more right to it he said «ألا تأمنوني وأنا أمين من في السماء», a man with sunken eyes said «اتق الله», Khalid asked to
 * strike his neck and was told «إني لم أومر أن أنقب قلوب الناس», and looking after him the Prophet ﷺ said a people would
 * come from his line who recite the Quran and pass through the din like an arrow. Told from Sahih al-Bukhari 4351
 * (al-Maghazi, the sending of Ali and Khalid to Yemen), whole. The four men and the man with sunken eyes are not linked.
 */
const theGoldFromYemen = {
  kind: 'EVENT',
  slug: 'the-gold-from-yemen',
  name: "الذهيبة من اليمن",
  nameTransliterated: "The gold from Yemen",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'ali-ibn-abi-talib' }, { person: 'prophet-muhammad' }, { person: 'khalid-ibn-al-walid' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا قُتَيْبَةُ: حَدَّثَنَا عَبْدُ الْوَاحِدِ، عَنْ عُمَارَةَ بْنِ الْقَعْقَاعِ بْنِ شُبْرُمَةَ: حَدَّثَنَا عَبْدُ الرَّحْمَنِ بْنُ أَبِي نُعْمٍ قَالَ: سَمِعْتُ أَبَا سَعِيدٍ الْخُدْرِيَّ يَقُولُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4351, url: 'https://sunnah.com/bukhari:4351' },
      moments: [
        { title: "قسمها بين أربعة نفر", text: "«بَعَثَ عَلِيُّ بْنُ أَبِي طَالِبٍ رضي الله عنه إِلَى رَسُولِ اللهِ ﷺ مِنَ الْيَمَنِ بِذُهَيْبَةٍ فِي أَدِيمٍ مَقْرُوظٍ، لَمْ تُحَصَّلْ مِنْ تُرَابِهَا، قَالَ: فَقَسَمَهَا بَيْنَ أَرْبَعَةِ نَفَرٍ: بَيْنَ عُيَيْنَةَ بْنِ بَدْرٍ، وَأَقْرَعَ بْنِ حَابِسٍ، وَزَيْدِ الْخَيْلِ، وَالرَّابِعُ: إِمَّا عَلْقَمَةُ، وَإِمَّا عَامِرُ بْنُ الطُّفَيْلِ، فَقَالَ رَجُلٌ مِنْ أَصْحَابِهِ: كُنَّا نَحْنُ أَحَقَّ بِهَذَا مِنْ هَؤُلَاءِ،", people: ['ali-ibn-abi-talib', 'prophet-muhammad'] },
        { title: "«ألا تأمنوني وأنا أمين من في السماء»", text: "قَالَ: فَبَلَغَ ذَلِكَ النَّبِيَّ ﷺ فَقَالَ: أَلَا تَأْمَنُونِي وَأَنَا أَمِينُ مَنْ فِي السَّمَاءِ، يَأْتِينِي خَبَرُ السَّمَاءِ صَبَاحًا وَمَسَاءً،", people: ['prophet-muhammad'] },
        { title: "«يا رسول الله، اتق الله»", text: "قَالَ: فَقَامَ رَجُلٌ غَائِرُ الْعَيْنَيْنِ، مُشْرِفُ الْوَجْنَتَيْنِ، نَاشِزُ الْجَبْهَةِ، كَثُّ اللِّحْيَةِ، مَحْلُوقُ الرَّأْسِ، مُشَمَّرُ الْإِزَارِ، فَقَالَ: يَا رَسُولَ اللهِ، اتَّقِ اللهَ، قَالَ: وَيْلَكَ، أَوَلَسْتُ أَحَقَّ أَهْلِ الْأَرْضِ أَنْ يَتَّقِيَ اللهَ،", people: ['prophet-muhammad'] },
        { title: "«إني لم أومر أن أنقب قلوب الناس»", text: "قَالَ: ثُمَّ وَلَّى الرَّجُلُ، قَالَ خَالِدُ بْنُ الْوَلِيدِ: يَا رَسُولَ اللهِ، أَلَا أَضْرِبُ عُنُقَهُ؟ قَالَ: لَا، لَعَلَّهُ أَنْ يَكُونَ يُصَلِّي، فَقَالَ خَالِدٌ: وَكَمْ مِنْ مُصَلٍّ يَقُولُ بِلِسَانِهِ مَا لَيْسَ فِي قَلْبِهِ، قَالَ رَسُولُ اللهِ ﷺ: إِنِّي لَمْ أُومَرْ أَنْ أَنْقُبَ قُلُوبَ النَّاسِ وَلَا أَشُقَّ بُطُونَهُمْ،", people: ['khalid-ibn-al-walid', 'prophet-muhammad'] },
        { title: "«يمرقون من الدين كما يمرق السهم من الرمية»", text: "قَالَ: ثُمَّ نَظَرَ إِلَيْهِ وَهُوَ مُقَفٍّ، فَقَالَ: إِنَّهُ يَخْرُجُ مِنْ ضِئْضِئِ هَذَا قَوْمٌ يَتْلُونَ كِتَابَ اللهِ رَطْبًا، لَا يُجَاوِزُ حَنَاجِرَهُمْ، يَمْرُقُونَ مِنَ الدِّينِ كَمَا يَمْرُقُ السَّهْمُ مِنَ الرَّمِيَّةِ وَأَظُنُّهُ قَالَ لَئِنْ أَدْرَكْتُهُمْ لَأَقْتُلَنَّهُمْ قَتْلَ ثَمُودَ.»", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theGoldFromYemen;
