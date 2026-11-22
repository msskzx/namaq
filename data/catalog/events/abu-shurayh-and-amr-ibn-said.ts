import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * As Amr ibn Sa'id sent troops against Makkah, Abu Shurayh told him what the Prophet ﷺ said the day after the conquest:
 * «إن مكة حرمها الله ولم يحرمها الناس… وإنما أذن لي فيها ساعة من نهار»; Amr answered «أنا أعلم بذلك منك يا أبا شريح».
 * Told from Sahih al-Bukhari 4295 (al-Maghazi, the chapter on the conquest), whole. Abu Shurayh has no catalog subject;
 * this Amr ibn Sa'id is the governor of Medina under Yazid, not the Companion amr-ibn-said-al-umawi, and is not linked.
 */
const abuShurayhAndAmrIbnSaid = {
  kind: 'EVENT',
  slug: 'abu-shurayh-and-amr-ibn-said',
  name: "أبو شريح وعمرو بن سعيد",
  nameTransliterated: "Abu Shurayh and Amr ibn Sa'id",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا سَعِيدُ بْنُ شُرَحْبِيلَ: حَدَّثَنَا اللَّيْثُ، عَنِ الْمَقْبُرِيِّ، عَنْ أَبِي شُرَيْحٍ الْعَدَوِيِّ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4295, url: 'https://sunnah.com/bukhari:4295' },
      moments: [
        { title: "«ائذن لي أيها الأمير»", text: "«أَنَّهُ قَالَ لِعَمْرِو بْنِ سَعِيدٍ، وَهُوَ يَبْعَثُ الْبُعُوثَ إِلَى مَكَّةَ: ائْذَنْ لِي أَيُّهَا الْأَمِيرُ، أُحَدِّثْكَ قَوْلًا قَامَ بِهِ رَسُولُ اللهِ ﷺ الْغَدَ يَوْمَ الْفَتْحِ، سَمِعَتْهُ أُذُنَايَ وَوَعَاهُ قَلْبِي، وَأَبْصَرَتْهُ عَيْنَايَ حِينَ تَكَلَّمَ بِهِ:", people: [] },
        { title: "«إن مكة حرمها الله»", text: "حَمِدَ اللهَ وَأَثْنَى عَلَيْهِ، ثُمَّ قَالَ: إِنَّ مَكَّةَ حَرَّمَهَا اللهُ، وَلَمْ يُحَرِّمْهَا النَّاسُ، لَا يَحِلُّ لِامْرِئٍ يُؤْمِنُ بِاللهِ وَالْيَوْمِ الْآخِرِ أَنْ يَسْفِكَ بِهَا دَمًا، وَلَا يَعْضِدَ بِهَا شَجَرًا، فَإِنْ أَحَدٌ تَرَخَّصَ لِقِتَالِ رَسُولِ اللهِ ﷺ فِيهَا، فَقُولُوا لَهُ: إِنَّ اللهَ أَذِنَ لِرَسُولِهِ وَلَمْ يَأْذَنْ لَكُمْ، وَإِنَّمَا أَذِنَ لِي فِيهَا سَاعَةً مِنْ نَهَارٍ، وَقَدْ عَادَتْ حُرْمَتُهَا الْيَوْمَ كَحُرْمَتِهَا بِالْأَمْسِ، وَلْيُبَلِّغِ الشَّاهِدُ الْغَائِبَ.", people: ['prophet-muhammad'] },
        { title: "«إن الحرم لا يعيذ عاصيا»", text: "فَقِيلَ لِأَبِي شُرَيْحٍ: مَاذَا قَالَ لَكَ عَمْرٌو؟ قَالَ: قَالَ: أَنَا أَعْلَمُ بِذَلِكَ مِنْكَ يَا أَبَا شُرَيْحٍ، إِنَّ الْحَرَمَ لَا يُعِيذُ عَاصِيًا، وَلَا فَارًّا بِدَمٍ، وَلَا فَارًّا بِخَرْبَةٍ».", people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abuShurayhAndAmrIbnSaid;
