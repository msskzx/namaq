import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * A man of Himyar killed an enemy and Khalid ibn al-Walid, his commander, held back the spoils; Awf ibn Malik told the
 * Prophet ﷺ, who said «ادفعه إليه», but when Awf taunted Khalid he grew angry, «لا تعطه. يا خالد!… هل أنتم تاركون لي
 * أمرائي؟». Told from Sahih Muslim 1753 (al-Jihad, the killer's right to the spoils), the first of its routes, whole. The
 * Himyari is not named.
 */
const khalidAndTheSpoilsOfTheHimyari = {
  kind: 'EVENT',
  slug: 'khalid-and-the-spoils-of-the-himyari',
  name: "خالد وسلب الحميري",
  nameTransliterated: "Khalid and the Himyari's spoils",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'khalid-ibn-al-walid' }, { person: 'awf-ibn-malik-al-ashjai' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "وحَدَّثَنِي أَبُو الطَّاهِرِ أَحْمَدُ بْنُ عَمْرِو بْنِ سَرْحٍ. أَخْبَرَنَا عَبْدُ اللَّهِ بْنُ وَهْبٍ. أَخْبَرَنِي معاوية ين صَالِحٍ عَنْ عَبْدِ الرَّحْمَنِ بْنِ جُبَيْرٍ، عَنْ أَبِيهِ، عَنْ عَوْفِ بْنِ مَالِكٍ. قَالَ:",
      source: { slug: 'sahih-muslim', hadith: 1753, url: 'https://sunnah.com/muslim:1753' },
      moments: [
        { title: "«ما منعك أن تعطيه سلبه؟»", text: "قَتَلَ رَجُلٌ مِنْ حِمْيَرَ رَجُلًا مِنَ الْعَدُوِّ. فَأَرَادَ سَلَبَهُ. فَمَنَعَهُ خَالِدُ بْنُ الْوَلِيدِ. وَكَانَ وَالِيًا عَلَيْهِمْ. فَأَتَى رَسُولَ اللَّهِ ﷺ عَوْفُ بْنُ مَالِكٍ. فَأَخْبَرَهُ. فَقَالَ لِخَالِدٍ (مَا مَنَعَكَ أَنْ تُعْطِيَهُ سَلَبَهُ؟) قَالَ: اسْتَكْثَرْتُهُ. يَا رَسُولَ اللَّهِ! قَالَ (ادْفَعْهُ إِلَيْهِ)", people: ['khalid-ibn-al-walid', 'awf-ibn-malik-al-ashjai', 'prophet-muhammad'],
          turns: [
            { text: "قَتَلَ رَجُلٌ مِنْ حِمْيَرَ رَجُلًا مِنَ الْعَدُوِّ. فَأَرَادَ سَلَبَهُ. فَمَنَعَهُ خَالِدُ بْنُ الْوَلِيدِ. وَكَانَ وَالِيًا عَلَيْهِمْ. فَأَتَى رَسُولَ اللَّهِ ﷺ عَوْفُ بْنُ مَالِكٍ. فَأَخْبَرَهُ." },
            { text: "فَقَالَ لِخَالِدٍ (مَا مَنَعَكَ أَنْ تُعْطِيَهُ سَلَبَهُ؟)", speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: "فَقَالَ لِخَالِدٍ", witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 150, quote: "(فقال) رسول الله ﷺ (لخالد: ما منعك)", url: "https://shamela.ws/book/18268/7825" } },
            { text: "قَالَ: اسْتَكْثَرْتُهُ. يَا رَسُولَ اللَّهِ!", speaker: { person: "khalid-ibn-al-walid", name: "خالد" }, lead: "قَالَ:", witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 150, quote: "(قال) خالد: (استكثرته)", url: "https://shamela.ws/book/18268/7825" } },
            { text: "قَالَ (ادْفَعْهُ إِلَيْهِ)", speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: "قَالَ", witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 150, quote: "فـ (ـقال) رسول الله ﷺ لخالد: (ادفعه)", url: "https://shamela.ws/book/18268/7825" } },
          ] },
        { title: "«هل أنتم تاركون لي أمرائي؟»", text: "فَمَرَّ خَالِدٌ بِعَوْفٍ فَجَرَّ بِرِدَائِهِ. ثُمَّ قَالَ: هَلْ أَنْجَزْتُ لَكَ مَا ذَكَرْتُ لَكَ مِنْ رَسُولِ اللَّهِ ﷺ؟ فَسَمِعَهُ رَسُولُ اللَّهِ ﷺ فَاسْتُغْضِبَ. فَقَالَ (لَا تُعْطِهِ. يَا خَالِدُ! لَا تُعْطِهِ. يَا خَالِدُ! هَلْ أَنْتُمْ تَارِكُونَ لِي أُمَرَائِي؟ إِنَّمَا أنا مَثَلُكُمْ وَمَثَلُهُمْ كَمَثَلِ رَجُلٍ اسْتُرْعِيَ إِبِلًا أَوْ غَنَمًا فَرَعَاهَا. ثُمَّ تَحَيَّنَ سَقْيَهَا. فَأَوْرَدَهَا حَوْضًا. فَشَرَعَتْ فِيهِ. فَشَرِبَتْ صَفْوَهُ وَتَرَكَتْ كَدْرَهُ. فَصَفْوُهُ لكم وكدره عليهم).", people: ['khalid-ibn-al-walid', 'awf-ibn-malik-al-ashjai', 'prophet-muhammad'],
          turns: [
            { text: "فَمَرَّ خَالِدٌ بِعَوْفٍ فَجَرَّ بِرِدَائِهِ." },
            { text: "ثُمَّ قَالَ: هَلْ أَنْجَزْتُ لَكَ مَا ذَكَرْتُ لَكَ مِنْ رَسُولِ اللَّهِ ﷺ؟", speaker: { person: "awf-ibn-malik-al-ashjai", name: "عوف" }, lead: "ثُمَّ قَالَ:", witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 150, quote: "(ثم قال) عوف لخالد: هل أنجزت", url: "https://shamela.ws/book/18268/7825" } },
            { text: "فَسَمِعَهُ رَسُولُ اللَّهِ ﷺ فَاسْتُغْضِبَ. فَقَالَ (لَا تُعْطِهِ. يَا خَالِدُ! لَا تُعْطِهِ. يَا خَالِدُ! هَلْ أَنْتُمْ تَارِكُونَ لِي أُمَرَائِي؟ إِنَّمَا أنا مَثَلُكُمْ وَمَثَلُهُمْ كَمَثَلِ رَجُلٍ اسْتُرْعِيَ إِبِلًا أَوْ غَنَمًا فَرَعَاهَا. ثُمَّ تَحَيَّنَ سَقْيَهَا. فَأَوْرَدَهَا حَوْضًا. فَشَرَعَتْ فِيهِ. فَشَرِبَتْ صَفْوَهُ وَتَرَكَتْ كَدْرَهُ. فَصَفْوُهُ لكم وكدره عليهم).", speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: "فَسَمِعَهُ رَسُولُ اللَّهِ ﷺ فَاسْتُغْضِبَ. فَقَالَ" },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default khalidAndTheSpoilsOfTheHimyari;
