import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Abu Bakr rode in from al-Sunh, went to Aisha's room, uncovered the Prophet's face, kissed him weeping and said «والله لا
 * يجمع الله عليك موتتين»; then he came out while Umar was speaking, told him to sit, and said «من كان منكم يعبد محمدا ﷺ
 * فإن محمدا قد مات، ومن كان منكم يعبد الله فإن الله حي لا يموت», reciting «وما محمد إلا رسول قد خلت من قبله الرسل», and
 * Umar's legs gave way under him. Told from Sahih al-Bukhari (al-Maghazi, the illness and death of the Prophet ﷺ), each
 * whole: Aisha's 4452 first; then 4454, al-Zuhri's next chain, Ibn Abbas's telling of the speech with Sa'id ibn
 * al-Musayyab's report of Umar (our copy has no 4453); then 4455, the kiss in one line.
 */
const abuBakrOnTheDayOfHisDeath = {
  kind: 'EVENT',
  slug: 'abu-bakr-on-the-day-of-his-death',
  name: "أبو بكر يوم وفاة النبي ﷺ",
  nameTransliterated: "Abu Bakr on the day of his death",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abu-bakr-as-siddiq' }, { person: 'aisha-bint-abi-bakr' }, { person: 'prophet-muhammad' }, { person: 'umar-ibn-al-khattab' }],
  tags: ['HIS_WORDS'],
  ayat: [
    {
      kind: 'RECITED',
      from: '3:144',
      to: '3:144',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4454, url: 'https://sunnah.com/bukhari:4454', quote: "قَالَ اللهُ: ﴿وَمَا مُحَمَّدٌ إِلا رَسُولٌ قَدْ خَلَتْ مِنْ قَبْلِهِ الرُّسُلُ﴾ إِلَى قَوْلِهِ: ﴿الشَّاكِرِينَ﴾" }],
    },
  ],
  reports: [
    {
      isnad: "حَدَّثَنَا يَحْيَى بْنُ بُكَيْرٍ، حَدَّثَنَا اللَّيْثُ، عَنْ عُقَيْلٍ، عَنِ ابْنِ شِهَابٍ قَالَ: أَخْبَرَنِي أَبُو سَلَمَةَ: أَنَّ عَائِشَةَ  أَخْبَرَتْهُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4452, url: 'https://sunnah.com/bukhari:4452' },
      moments: [
        { title: "أكب عليه فقبله وبكى", text: "«أَنَّ أَبَا بَكْرٍ رضي الله عنه أَقْبَلَ عَلَى فَرَسٍ مِنْ مَسْكَنِهِ بِالسُّنْحِ، حَتَّى نَزَلَ فَدَخَلَ الْمَسْجِدَ، فَلَمْ يُكَلِّمِ النَّاسَ حَتَّى دَخَلَ عَلَى عَائِشَةَ، فَتَيَمَّمَ رَسُولَ اللهِ ﷺ وَهُوَ مُغَشًّى بِثَوْبِ حِبَرَةٍ، فَكَشَفَ عَنْ وَجْهِهِ ثُمَّ أَكَبَّ عَلَيْهِ فَقَبَّلَهُ وَبَكَى،", people: ['abu-bakr-as-siddiq', 'aisha-bint-abi-bakr', 'prophet-muhammad'] },
        { title: "«لا يجمع الله عليك موتتين»", text: "ثُمَّ قَالَ: بِأَبِي أَنْتَ وَأُمِّي، وَاللهِ لَا يَجْمَعُ اللهُ عَلَيْكَ مَوْتَتَيْنِ، أَمَّا الْمَوْتَةُ الَّتِي كُتِبَتْ عَلَيْكَ فَقَدْ مُتَّهَا».", people: ['abu-bakr-as-siddiq', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: "قَالَ الزُّهْرِيُّ: وَحَدَّثَنِي أَبُو سَلَمَةَ، عَنْ عَبْدِ اللهِ بْنِ عَبَّاسٍ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4454, url: 'https://sunnah.com/bukhari:4454' },
      moments: [
        { title: "«اجلس يا عمر»", text: "«أَنَّ أَبَا بَكْرٍ خَرَجَ وَعُمَرُ يُكَلِّمُ النَّاسَ، فَقَالَ: اجْلِسْ يَا عُمَرُ، فَأَبَى عُمَرُ أَنْ يَجْلِسَ، فَأَقْبَلَ النَّاسُ إِلَيْهِ وَتَرَكُوا عُمَرَ،", people: ['abu-bakr-as-siddiq', 'umar-ibn-al-khattab'] },
        { title: "«فإن محمدا قد مات»", text: "فَقَالَ أَبُو بَكْرٍ: أَمَّا بَعْدُ؛ مَنْ كَانَ مِنْكُمْ يَعْبُدُ مُحَمَّدًا ﷺ فَإِنَّ مُحَمَّدًا قَدْ مَاتَ، وَمَنْ كَانَ مِنْكُمْ يَعْبُدُ اللهَ، فَإِنَّ اللهَ حَيٌّ لَا يَمُوتُ، قَالَ اللهُ: ﴿وَمَا مُحَمَّدٌ إِلا رَسُولٌ قَدْ خَلَتْ مِنْ قَبْلِهِ الرُّسُلُ﴾ إِلَى قَوْلِهِ: ﴿الشَّاكِرِينَ﴾. وَقَالَ: وَاللهِ لَكَأَنَّ النَّاسَ لَمْ يَعْلَمُوا أَنَّ اللهَ أَنْزَلَ هَذِهِ الْآيَةَ حَتَّى تَلَاهَا أَبُو بَكْرٍ، فَتَلَقَّاهَا مِنْهُ النَّاسُ كُلُّهُمْ، فَمَا أَسْمَعُ بَشَرًا مِنَ النَّاسِ إِلَّا يَتْلُوهَا.", people: ['abu-bakr-as-siddiq', 'prophet-muhammad'] },
        { title: "«حتى ما تقلني رجلاي»", text: "فَأَخْبَرَنِي سَعِيدُ بْنُ الْمُسَيَّبِ: أَنَّ عُمَرَ قَالَ: وَاللهِ مَا هُوَ إِلَّا أَنْ سَمِعْتُ أَبَا بَكْرٍ تَلَاهَا فَعَقِرْتُ، حَتَّى مَا تُقِلُّنِي رِجْلَايَ، وَحَتَّى أَهْوَيْتُ إِلَى الْأَرْضِ حِينَ سَمِعْتُهُ تَلَاهَا، أَنَّ النَّبِيَّ ﷺ قَدْ مَاتَ».", people: ['umar-ibn-al-khattab', 'abu-bakr-as-siddiq'] },
      ],
    },
    {
      isnad: "حَدَّثَنِي عَبْدُ اللهِ بْنُ أَبِي شَيْبَةَ، حَدَّثَنَا يَحْيَى بْنُ سَعِيدٍ، عَنْ سُفْيَانَ، عَنْ مُوسَى بْنِ أَبِي عَائِشَةَ، عَنْ عُبَيْدِ اللهِ بْنِ عَبْدِ اللهِ بْنِ عُتْبَةَ، عَنْ عَائِشَةَ وَابْنِ عَبَّاسٍ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4455, url: 'https://sunnah.com/bukhari:4455' },
      moments: [
        { title: "قبله بعد موته", text: "«أَنَّ أَبَا بَكْرٍ رضي الله عنه قَبَّلَ النَّبِيَّ ﷺ بَعْدَ مَوْتِهِ.»", people: ['abu-bakr-as-siddiq', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abuBakrOnTheDayOfHisDeath;
