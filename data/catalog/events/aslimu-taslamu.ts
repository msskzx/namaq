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
        { title: "«انطلقوا إلى يهود»", text: "بَيْنَا نَحْنُ فِي الْمَسْجِدِ، إِذْ خَرَجَ إِلَيْنَا رَسُولُ اللَّهِ ﷺ فَقَالَ (انْطَلِقُوا إِلَى يَهُودَ) فَخَرَجْنَا مَعَهُ. حَتَّى جِئْنَاهُمْ. فَقَامَ رَسُولُ اللَّهِ ﷺ فَنَادَاهُمْ. فَقَالَ (يَا مَعْشَرَ يَهُودَ! أَسْلِمُوا تَسْلَمُوا).", people: ['prophet-muhammad', 'abu-hurayrah'] },
        { title: "«اعلموا أنما الأرض لله ورسوله»", text: "فَقَالُوا: قَدْ بَلَّغْتَ. يَا أَبَا الْقَاسِمِ! فَقَالَ لَهُمْ رَسُولُ اللَّهِ ﷺ (ذَلِكَ أُرِيدُ. أَسْلِمُوا تَسْلَمُوا) فَقَالُوا: قَدْ بَلَّغْتَ يَا أَبَا الْقَاسِمِ! فَقَالَ لَهُمْ رَسُولُ اللَّهِ ﷺ (ذَلِكَ أُرِيدُ) فَقَالَ لَهُمْ الثَّالِثَةَ. فَقَالَ (اعْلَمُوا أَنَّمَا الْأَرْضُ لِلَّهِ وَرَسُولِهِ. وَأَنِّي أُرِيدُ أَنْ أُجْلِيَكُمْ مِنْ هَذِهِ الْأَرْضِ فَمَنْ وَجَدَ مِنْكُمْ بِمَالِهِ شَيْئًا فَلْيَبِعْهُ. وَإِلَّا فَاعْلَمُوا أَنَّ الْأَرْضَ لِلَّهِ ورسوله).", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default aslimuTaslamu;
