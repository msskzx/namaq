import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At Khaybar the Prophet ﷺ said he would give the banner next day to a man who loves Allah and His Messenger and whom they
 * love; everyone hoped for it, he asked for Ali, who had sore eyes, spat in them and they healed, gave him the banner and
 * told him to call them to Islam first. Told from Sahih al-Bukhari 4210 (al-Maghazi, the chapter on Khaybar), whole; then
 * Salamah's 4209, whole, folded.
 */
const theBannerAtKhaybar = {
  kind: 'EVENT',
  slug: 'the-banner-at-khaybar',
  name: "الراية يوم خيبر",
  nameTransliterated: "The banner at Khaybar",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'ali-ibn-abi-talib' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا قُتَيْبَةُ بْنُ سَعِيدٍ: حَدَّثَنَا يَعْقُوبُ بْنُ عَبْدِ الرَّحْمَنِ، عَنْ أَبِي حَازِمٍ قَالَ: أَخْبَرَنِي سَهْلُ بْنُ سَعْدٍ  رضي الله عنه:",
      source: { slug: 'sahih-al-bukhari', hadith: 4210, url: 'https://sunnah.com/bukhari:4210' },
      moments: [
        { title: "«لأعطين هذه الراية غدا»", text: "«أَنَّ رَسُولَ اللهِ ﷺ قَالَ يَوْمَ خَيْبَرَ: لَأُعْطِيَنَّ هَذِهِ الرَّايَةَ غَدًا رَجُلًا يَفْتَحُ اللهُ عَلَى يَدَيْهِ، يُحِبُّ اللهَ وَرَسُولَهُ وَيُحِبُّهُ اللهُ وَرَسُولُهُ. قَالَ: فَبَاتَ النَّاسُ يَدُوكُونَ لَيْلَتَهُمْ أَيُّهُمْ يُعْطَاهَا،", people: ['prophet-muhammad'] },
        { title: "فبصق في عينيه", text: "فَلَمَّا أَصْبَحَ النَّاسُ غَدَوْا عَلَى رَسُولِ اللهِ ﷺ كُلُّهُمْ يَرْجُو أَنْ يُعْطَاهَا، فَقَالَ: أَيْنَ عَلِيُّ بْنُ أَبِي طَالِبٍ فَقِيلَ: هُوَ يَا رَسُولَ اللهِ، يَشْتَكِي عَيْنَيْهِ، قَالَ: فَأَرْسَِلُوا إِلَيْهِ. فَأُتِيَ بِهِ فَبَصَقَ رَسُولُ اللهِ ﷺ فِي عَيْنَيْهِ وَدَعَا لَهُ، فَبَرَأَ حَتَّى كَأَنْ لَمْ يَكُنْ بِهِ وَجَعٌ، فَأَعْطَاهُ الرَّايَةَ،", people: ['prophet-muhammad', 'ali-ibn-abi-talib'] },
        { title: "«لأن يهدي الله بك رجلا واحدا»", text: "فَقَالَ عَلِيٌّ: يَا رَسُولَ اللهِ، أُقَاتِلُهُمْ حَتَّى يَكُونُوا مِثْلَنَا؟ فَقَالَ: انْفُذْ عَلَى رِسْلِكَ حَتَّى تَنْزِلَ بِسَاحَتِهِمْ، ثُمَّ ادْعُهُمْ إِلَى الْإِسْلَامِ، وَأَخْبِرْهُمْ بِمَا يَجِبُ عَلَيْهِمْ مِنْ حَقِّ اللهِ فِيهِ، فَوَاللهِ لَأَنْ يَهْدِيَ اللهُ بِكَ رَجُلًا وَاحِدًا، خَيْرٌ لَكَ مِنْ أَنْ يَكُونَ لَكَ حُمْرُ النَّعَمِ».", people: ['ali-ibn-abi-talib', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا عَبْدُ اللهِ بْنُ مَسْلَمَةَ: حَدَّثَنَا حَاتِمٌ، عَنْ يَزِيدَ بْنِ أَبِي عُبَيْدٍ، عَنْ سَلَمَةَ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4209, url: 'https://sunnah.com/bukhari:4209' },
      moments: [
        { title: "تخلف وكان رمدا", text: "«كَانَ عَلِيٌّ رضي الله عنه تَخَلَّفَ عَنِ النَّبِيِّ ﷺ فِي خَيْبَرَ، وَكَانَ رَمِدًا، فَقَالَ: أَنَا أَتَخَلَّفُ عَنِ النَّبِيِّ ﷺ، فَلَحِقَ", people: ['ali-ibn-abi-talib', 'prophet-muhammad'] },
        { title: "«رجل يحبه الله ورسوله»", text: "فَلَمَّا بِتْنَا اللَّيْلَةَ الَّتِي فُتِحَتْ، قَالَ: لَأُعْطِيَنَّ الرَّايَةَ غَدًا، أَوْ: لَيَأْخُذَنَّ الرَّايَةَ غَدًا رَجُلٌ يُحِبُّهُ اللهُ وَرَسُولُهُ، يُفْتَحُ عَلَيْهِ فَنَحْنُ نَرْجُوهَا، فَقِيلَ: هَذَا عَلِيٌّ، فَأَعْطَاهُ، فَفُتِحَ عَلَيْهِ».", people: ['prophet-muhammad', 'ali-ibn-abi-talib'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theBannerAtKhaybar;
