import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * From the mosque the Prophet ﷺ took his Companions to the Jews and called «يا معشر يهود! أسلموا تسلموا» three times; they
 * said «قد بلغت يا أبا القاسم», and he told them the land was Allah's and His Messenger's and he would remove them, so
 * whoever had property should sell it. Told from Sahih Muslim 1765 (al-Jihad, the removal of the Jews from the Hijaz),
 * whole. Abu Hurayrah, who went with him, is linked.
 */
const aslimuTaslamu = {
  kind: 'EVENT',
  slug: 'aslimu-taslamu',
  name: "أسلموا تسلموا",
  nameTransliterated: "Accept islam and be safe",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-hurayrah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا قُتَيْبَةُ بن سعيد. حدثنا ليث عن سعيد بن أَبِي سَعِيدٍ، عَنْ أَبِيهِ، عَنْ أَبِي هُرَيْرَةَ؛ أَنَّهُ قَالَ:",
      source: { slug: 'sahih-muslim', hadith: 1765, url: 'https://sunnah.com/muslim:1765' },
      moments: [
        { title: "«انطلقوا إلى يهود»", text: "بَيْنَا نَحْنُ فِي الْمَسْجِدِ، إِذْ خَرَجَ إِلَيْنَا رَسُولُ اللَّهِ ﷺ فَقَالَ (انْطَلِقُوا إِلَى يَهُودَ) فَخَرَجْنَا مَعَهُ. حَتَّى جِئْنَاهُمْ. فَقَامَ رَسُولُ اللَّهِ ﷺ فَنَادَاهُمْ. فَقَالَ (يَا مَعْشَرَ يَهُودَ! أَسْلِمُوا تَسْلَمُوا).", people: ['prophet-muhammad', 'abu-hurayrah'],
          turns: [
            { text: "بَيْنَا نَحْنُ فِي الْمَسْجِدِ، إِذْ خَرَجَ إِلَيْنَا رَسُولُ اللَّهِ ﷺ" },
            { text: "فَقَالَ (انْطَلِقُوا إِلَى يَهُودَ)", speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: "فَقَالَ", witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 199, quote: "(فقال) لنا رسول الله ﷺ: (انطلقوا)", url: "https://shamela.ws/book/18268/7874" } },
            { text: "فَخَرَجْنَا مَعَهُ. حَتَّى جِئْنَاهُمْ." },
            { text: "فَقَامَ رَسُولُ اللَّهِ ﷺ فَنَادَاهُمْ. فَقَالَ (يَا مَعْشَرَ يَهُودَ! أَسْلِمُوا تَسْلَمُوا).", speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: "فَقَامَ رَسُولُ اللَّهِ ﷺ فَنَادَاهُمْ. فَقَالَ" },
          ] },
        { title: "«اعلموا أنما الأرض لله ورسوله»", text: "فَقَالُوا: قَدْ بَلَّغْتَ. يَا أَبَا الْقَاسِمِ! فَقَالَ لَهُمْ رَسُولُ اللَّهِ ﷺ (ذَلِكَ أُرِيدُ. أَسْلِمُوا تَسْلَمُوا) فَقَالُوا: قَدْ بَلَّغْتَ يَا أَبَا الْقَاسِمِ! فَقَالَ لَهُمْ رَسُولُ اللَّهِ ﷺ (ذَلِكَ أُرِيدُ) فَقَالَ لَهُمْ الثَّالِثَةَ. فَقَالَ (اعْلَمُوا أَنَّمَا الْأَرْضُ لِلَّهِ وَرَسُولِهِ. وَأَنِّي أُرِيدُ أَنْ أُجْلِيَكُمْ مِنْ هَذِهِ الْأَرْضِ فَمَنْ وَجَدَ مِنْكُمْ بِمَالِهِ شَيْئًا فَلْيَبِعْهُ. وَإِلَّا فَاعْلَمُوا أَنَّ الْأَرْضَ لِلَّهِ ورسوله).", people: ['prophet-muhammad'],
          turns: [
            { text: "فَقَالُوا: قَدْ بَلَّغْتَ. يَا أَبَا الْقَاسِمِ!", speaker: { name: "اليهود" }, lead: "فَقَالُوا:", witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 200, quote: "ولكن ملاعين اليهود إنما فهموا منه الدعاء إلى الإسلام وكرهوه (فقالوا) في جوابه (قد بلَّغت يا أبا القاسم)", url: "https://shamela.ws/book/18268/7875" } },
            { text: "فَقَالَ لَهُمْ رَسُولُ اللَّهِ ﷺ (ذَلِكَ أُرِيدُ. أَسْلِمُوا تَسْلَمُوا)", speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: "فَقَالَ لَهُمْ رَسُولُ اللَّهِ ﷺ" },
            { text: "فَقَالُوا: قَدْ بَلَّغْتَ يَا أَبَا الْقَاسِمِ!" },
            { text: "فَقَالَ لَهُمْ رَسُولُ اللَّهِ ﷺ (ذَلِكَ أُرِيدُ)", speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: "فَقَالَ لَهُمْ رَسُولُ اللَّهِ ﷺ" },
            { text: "فَقَالَ لَهُمْ الثَّالِثَةَ. فَقَالَ (اعْلَمُوا أَنَّمَا الْأَرْضُ لِلَّهِ وَرَسُولِهِ. وَأَنِّي أُرِيدُ أَنْ أُجْلِيَكُمْ مِنْ هَذِهِ الْأَرْضِ فَمَنْ وَجَدَ مِنْكُمْ بِمَالِهِ شَيْئًا فَلْيَبِعْهُ. وَإِلَّا فَاعْلَمُوا أَنَّ الْأَرْضَ لِلَّهِ ورسوله).", speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: "فَقَالَ لَهُمْ الثَّالِثَةَ. فَقَالَ", witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 200, quote: "(فقال لهم رسول الله ﷺ ذلك) أي اعترافكم بالتبليغ (أريد) منكم (فقال لهم) أيضًا أسلموا تسلموا المرة (الثالثة فقال)", url: "https://shamela.ws/book/18268/7875" } },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default aslimuTaslamu;
