import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Aisha told Urwah that his father al-Zubayr and Abu Bakr were of «الذين استجابوا لله والرسول»: when the mushrikun left Uhud
 * the Prophet ﷺ feared they would return and asked who would go after them, and seventy volunteered. Told from Sahih
 * al-Bukhari 4077 (al-Maghazi, the chapter on that ayah), whole.
 */
const thoseWhoAnsweredAfterUhud = {
  kind: 'EVENT',
  slug: 'those-who-answered-after-uhud',
  name: "الذين استجابوا لله والرسول",
  nameTransliterated: "Those who answered Allah and the Messenger",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'az-zubayr-ibn-al-awwam' }, { person: 'abu-bakr-as-siddiq' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  ayat: [
    {
      kind: 'RECITED',
      from: '3:172',
      to: '3:172',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4077, url: 'https://sunnah.com/bukhari:4077', quote: "﴿الَّذِينَ اسْتَجَابُوا لِلهِ وَالرَّسُولِ مِنْ بَعْدِ مَا أَصَابَهُمُ الْقَرْحُ لِلَّذِينَ أَحْسَنُوا مِنْهُمْ وَاتَّقَوْا أَجْرٌ عَظِيمٌ﴾" }],
    },
  ],
  reports: [
    {
      isnad: "حَدَّثَنَا مُحَمَّدٌ: حَدَّثَنَا أَبُو مُعَاوِيَةَ، عَنْ هِشَامٍ، عَنْ أَبِيهِ، عَنْ عَائِشَةَ  رضي الله عنها:",
      source: { slug: 'sahih-al-bukhari', hadith: 4077, url: 'https://sunnah.com/bukhari:4077' },
      moments: [
        { title: "«كان أبوك منهم»", text: "«﴿الَّذِينَ اسْتَجَابُوا لِلهِ وَالرَّسُولِ مِنْ بَعْدِ مَا أَصَابَهُمُ الْقَرْحُ لِلَّذِينَ أَحْسَنُوا مِنْهُمْ وَاتَّقَوْا أَجْرٌ عَظِيمٌ﴾ قَالَتْ لِعُرْوَةَ: يَا ابْنَ أُخْتِي، كَانَ أَبُوكَ مِنْهُمُ: الزُّبَيْرُ وَأَبُو بَكْرٍ،", people: ['az-zubayr-ibn-al-awwam', 'abu-bakr-as-siddiq'] },
        { title: "«من يذهب في إثرهم؟»", text: "لَمَّا أَصَابَ رَسُولَ اللهِ ﷺ مَا أَصَابَ يَوْمَ أُحُدٍ، وَانْصَرَفَ عَنْهُ الْمُشْرِكُونَ، خَافَ أَنْ يَرْجِعُوا، قَالَ: مَنْ يَذْهَبُ فِي إِثْرِهِمْ؟ فَانْتَدَبَ مِنْهُمْ سَبْعُونَ رَجُلًا، قَالَ: كَانَ فِيهِمْ أَبُو بَكْرٍ وَالزُّبَيْرُ.»", people: ['prophet-muhammad', 'abu-bakr-as-siddiq', 'az-zubayr-ibn-al-awwam'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default thoseWhoAnsweredAfterUhud;
