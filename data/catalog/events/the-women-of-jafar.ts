import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * When the news of Zayd, Ja'far and Ibn Rawahah came, the Prophet ﷺ sat with grief in his face; a man came three times
 * about the weeping of Ja'far's women and was told «فاحث في أفواههن من التراب», and Aisha, watching through the gap in the
 * door, said to him «أرغم الله أنفك». Told from Sahih al-Bukhari 4263 (al-Maghazi, the chapter on Mu'tah), whole. The man
 * is not named and is not linked.
 */
const theWomenOfJafar = {
  kind: 'EVENT',
  slug: 'the-women-of-jafar',
  name: "نساء جعفر",
  nameTransliterated: "The women of Ja'far",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'zaid-ibn-harithah' }, { person: 'jaafar-ibn-abi-talib' }, { person: 'abdullah-ibn-rawahah' }, { person: 'aisha-bint-abi-bakr' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا قُتَيْبَةُ: حَدَّثَنَا عَبْدُ الْوَهَّابِ قَالَ: سَمِعْتُ يَحْيَى بْنَ سَعِيدٍ قَالَ: أَخْبَرَتْنِي عَمْرَةُ قَالَتْ: سَمِعْتُ عَائِشَةَ  رضي الله عنها تَقُولُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4263, url: 'https://sunnah.com/bukhari:4263' },
      moments: [
        { title: "جلس يعرف فيه الحزن", text: "«لَمَّا جَاءَ قَتْلُ ابْنِ حَارِثَةَ، وَجَعْفَرِ بْنِ أَبِي طَالِبٍ، وَعَبْدِ اللهِ بْنِ رَوَاحَةَ رضي الله عنهم، جَلَسَ رَسُولُ اللهِ ﷺ يُعْرَفُ فِيهِ الْحُزْنُ، قَالَتْ عَائِشَةُ: وَأَنَا أَطَّلِعُ مِنْ صَائِرِ الْبَابِ، تَعْنِي مِنْ شَقِّ الْبَابِ،", people: ['prophet-muhammad', 'zaid-ibn-harithah', 'jaafar-ibn-abi-talib', 'abdullah-ibn-rawahah', 'aisha-bint-abi-bakr'] },
        { title: "«فاحث في أفواههن من التراب»", text: "فَأَتَاهُ رَجُلٌ، فَقَالَ: أَيْ رَسُولَ اللهِ إِنَّ نِسَاءَ جَعْفَرٍ، قَالَ: وَذَكَرَ بُكَاءَهُنَّ، فَأَمَرَهُ أَنْ يَنْهَاهُنَّ، قَالَ: فَذَهَبَ الرَّجُلُ ثُمَّ أَتَى، فَقَالَ: قَدْ نَهَيْتُهُنَّ، وَذَكَرَ أَنَّهُ لَمْ يُطِعْنَهُ، قَالَ: فَأَمَرَ أَيْضًا، فَذَهَبَ ثُمَّ أَتَى فَقَالَ: وَاللهِ لَقَدْ غَلَبْنَنَا، فَزَعَمَتْ أَنَّ رَسُولَ اللهِ ﷺ قَالَ: فَاحْثُ فِي أَفْوَاهِهِنَّ مِنَ التُّرَابِ.", people: ['prophet-muhammad'] },
        { title: "«أرغم الله أنفك»", text: "قَالَتْ عَائِشَةُ: فَقُلْتُ: أَرْغَمَ اللهُ أَنْفَكَ، فَوَاللهِ مَا أَنْتَ تَفْعَلُ، وَمَا تَرَكْتَ رَسُولَ اللهِ ﷺ مِنَ الْعَنَاءِ».", people: ['aisha-bint-abi-bakr', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theWomenOfJafar;
