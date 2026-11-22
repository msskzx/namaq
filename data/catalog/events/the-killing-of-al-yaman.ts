import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At Uhud, when the mushrikun were routed, Iblis cried «أي عباد الله أخراكم» and the Muslims turned on each other; Hudhayfah
 * saw his father al-Yaman among them and cried out, but they killed him, and Hudhayfah said «يغفر الله لكم». Told from Sahih
 * al-Bukhari 4065 (al-Maghazi, the chapter on Uhud), whole, with al-Bukhari's note on the word. Al-Yaman has no catalog
 * subject and is not linked.
 */
const theKillingOfAlYaman = {
  kind: 'EVENT',
  slug: 'the-killing-of-al-yaman',
  name: "مقتل اليمان",
  nameTransliterated: "The killing of al-Yaman",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'hudhayfah-ibn-al-yaman' }],
  reports: [
    {
      isnad: "حَدَّثَنِي عُبَيْدُ اللهِ بْنُ سَعِيدٍ: حَدَّثَنَا أَبُو أُسَامَةَ، عَنْ هِشَامِ بْنِ عُرْوَةَ، عَنْ أَبِيهِ، عَنْ عَائِشَةَ  رضي الله عنها قَالَتْ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4065, url: 'https://sunnah.com/bukhari:4065' },
      moments: [
        {
          title: "«أي عباد الله أخراكم»",
          text: "«لَمَّا كَانَ يَوْمُ أُحُدٍ هُزِمَ الْمُشْرِكُونَ، فَصَرَخَ إِبْلِيسُ لَعْنَةُ اللهِ عَلَيْهِ: أَيْ عِبَادَ اللهِ أُخْرَاكُمْ، فَرَجَعَتْ أُولَاهُمْ فَاجْتَلَدَتْ هِيَ وَأُخْرَاهُمْ،",
          people: [],
          turns: [
            { text: "«لَمَّا كَانَ يَوْمُ أُحُدٍ هُزِمَ الْمُشْرِكُونَ،" },
            { text: "فَصَرَخَ إِبْلِيسُ لَعْنَةُ اللهِ عَلَيْهِ: أَيْ عِبَادَ اللهِ أُخْرَاكُمْ،", speaker: { name: "إبليس" }, lead: "فَصَرَخَ إِبْلِيسُ لَعْنَةُ اللهِ عَلَيْهِ:" },
            { text: "فَرَجَعَتْ أُولَاهُمْ فَاجْتَلَدَتْ هِيَ وَأُخْرَاهُمْ،" },
          ],
        },
        {
          title: "«أي عباد الله أبي أبي»",
          text: "فَبَصُرَ حُذَيْفَةُ فَإِذَا هُوَ بِأَبِيهِ الْيَمَانِ، فَقَالَ: أَيْ عِبَادَ اللهِ أَبِي أَبِي، قَالَ: قَالَتْ: فَوَاللهِ مَا احْتَجَزُوا حَتَّى قَتَلُوهُ، فَقَالَ حُذَيْفَةُ: يَغْفِرُ اللهُ لَكُمْ.",
          people: ['hudhayfah-ibn-al-yaman'],
          turns: [
            { text: "فَبَصُرَ حُذَيْفَةُ فَإِذَا هُوَ بِأَبِيهِ الْيَمَانِ، فَقَالَ: أَيْ عِبَادَ اللهِ أَبِي أَبِي،", speaker: { person: "hudhayfah-ibn-al-yaman", name: "حذيفة" }, lead: "فَبَصُرَ حُذَيْفَةُ فَإِذَا هُوَ بِأَبِيهِ الْيَمَانِ، فَقَالَ:" },
            { text: "قَالَ: قَالَتْ: فَوَاللهِ مَا احْتَجَزُوا حَتَّى قَتَلُوهُ،" },
            { text: "فَقَالَ حُذَيْفَةُ: يَغْفِرُ اللهُ لَكُمْ.", speaker: { person: "hudhayfah-ibn-al-yaman", name: "حذيفة" }, lead: "فَقَالَ حُذَيْفَةُ:" },
          ],
        },
        {
          title: "بقية خير",
          text: "قَالَ عُرْوَةُ: فَوَاللهِ مَا زَالَتْ فِي حُذَيْفَةَ بَقِيَّةُ خَيْرٍ، حَتَّى لَحِقَ بِاللهِ». بَصُرْتُ عَلِمْتُ، مِنَ الْبَصِيرَةِ فِي الْأَمْرِ، وَأَبْصَرْتُ مِنْ بَصَرِ الْعَيْنِ، وَيُقَالُ: بَصُرْتُ وَأَبْصَرْتُ وَاحِدٌ.",
          people: ['hudhayfah-ibn-al-yaman'],
          turns: [
            { text: "قَالَ عُرْوَةُ: فَوَاللهِ مَا زَالَتْ فِي حُذَيْفَةَ بَقِيَّةُ خَيْرٍ، حَتَّى لَحِقَ بِاللهِ». بَصُرْتُ عَلِمْتُ، مِنَ الْبَصِيرَةِ فِي الْأَمْرِ، وَأَبْصَرْتُ مِنْ بَصَرِ الْعَيْنِ، وَيُقَالُ: بَصُرْتُ وَأَبْصَرْتُ وَاحِدٌ." },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theKillingOfAlYaman;
