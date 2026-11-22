import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At the dawn prayer on Monday, with Abu Bakr leading, the Prophet ﷺ lifted the curtain of Aisha's room, looked at them in
 * their rows and smiled; Abu Bakr stepped back thinking he would come out, the Muslims almost broke their prayer for joy,
 * and he signed to them to finish, went in and let down the curtain. Told from Sahih al-Bukhari 4448 (al-Maghazi, the
 * illness of the Prophet ﷺ), whole.
 */
const theLastLookAtThePrayer = {
  kind: 'EVENT',
  slug: 'the-last-look-at-the-prayer',
  name: "نظرته ﷺ إلى الصفوف يوم الاثنين",
  nameTransliterated: "His last look at the prayer",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-bakr-as-siddiq' }],
  reports: [
    {
      isnad: "حَدَّثَنَا سَعِيدُ بْنُ عُفَيْرٍ قَالَ: حَدَّثَنِي اللَّيْثُ قَالَ: حَدَّثَنِي عُقَيْلٌ، عَنِ ابْنِ شِهَابٍ قَالَ: حَدَّثَنِي أَنَسُ بْنُ مَالِكٍ  رضي الله عنه:",
      source: { slug: 'sahih-al-bukhari', hadith: 4448, url: 'https://sunnah.com/bukhari:4448' },
      moments: [
        { title: "كشف ستر حجرة عائشة", text: "«أَنَّ الْمُسْلِمِينَ بَيْنَا هُمْ فِي صَلَاةِ الْفَجْرِ مِنْ يَوْمِ الاِثْنَيْنِ، وَأَبُو بَكْرٍ يُصَلِّي لَهُمْ، لَمْ يَفْجَأْهُمْ إِلَّا رَسُولُ اللهِ ﷺ قَدْ كَشَفَ سِتْرَ حُجْرَةِ عَائِشَةَ، فَنَظَرَ إِلَيْهِمْ وَهُمْ فِي صُفُوفِ الصَّلَاةِ، ثُمَّ تَبَسَّمَ يَضْحَكُ، فَنَكَصَ أَبُو بَكْرٍ عَلَى عَقِبَيْهِ لِيَصِلَ الصَّفَّ، وَظَنَّ أَنَّ رَسُولَ اللهِ ﷺ يُرِيدُ أَنْ يَخْرُجَ إِلَى الصَّلَاةِ،", people: ['prophet-muhammad', 'abu-bakr-as-siddiq'] },
        { title: "«أن أتموا صلاتكم»", text: "فَقَالَ أَنَسٌ: وَهَمَّ الْمُسْلِمُونَ أَنْ يَفْتَتِنُوا فِي صَلَاتِهِمْ فَرَحًا بِرَسُولِ اللهِ ﷺ، فَأَشَارَ إِلَيْهِمْ بِيَدِهِ رَسُولُ اللهِ ﷺ: أَنْ أَتِمُّوا صَلَاتَكُمْ، ثُمَّ دَخَلَ الْحُجْرَةَ، وَأَرْخَى السِّتْرَ.»", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theLastLookAtThePrayer;
