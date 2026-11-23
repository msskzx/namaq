import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Jibril was slow to come to the Prophet ﷺ and the mushrikun said «قد ودع محمد», and Allah sent down «والضحى. والليل إذا
 * سجى. ما ودعك ربك وما قلى». Told from Sahih Muslim 1797 (al-Jihad, the chapter on what the Prophet ﷺ met from the
 * mushrikun), whole.
 */
const theRevelationOfAdDuha = {
  kind: 'EVENT',
  slug: 'the-revelation-of-ad-duha',
  name: "نزول سورة الضحى",
  nameTransliterated: "The revelation of al-Duha",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '93:1',
      to: '93:3',
      evidence: [{ source: 'sahih-muslim', hadith: 1797, url: 'https://sunnah.com/muslim:1797', quote: "فَأَنْزَلَ اللَّهُ عَزَّ وَجَلَّ: ﴿وَالضُّحَى. وَاللَّيْلِ إِذَا سَجَى. مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَى﴾" }],
    },
  ],
  reports: [
    {
      isnad: "حَدَّثَنَا إِسْحَاقُ بْنُ إِبْرَاهِيمَ. أَخْبَرَنَا سُفْيَانُ عَنْ الْأَسْوَدِ بْنِ قَيْسٍ؛ أَنَّهُ سَمِعَ جُنْدُبًا يَقُولُ:",
      source: { slug: 'sahih-muslim', hadith: 1797, url: 'https://sunnah.com/muslim:1797' },
      moments: [
        { title: "«قد ودع محمد»", text: "أَبْطَأَ جِبْرِيلُ عَلَى رَسُولِ اللَّهِ ﷺ. فَقَالَ الْمُشْرِكُونَ: قَدْ وُدِّعَ مُحَمَّدٌ.", people: ['prophet-muhammad'],
          turns: [
            { text: "أَبْطَأَ جِبْرِيلُ عَلَى رَسُولِ اللَّهِ ﷺ." },
            { text: "فَقَالَ الْمُشْرِكُونَ: قَدْ وُدِّعَ مُحَمَّدٌ.", speaker: { name: "المشركون" }, lead: "فَقَالَ الْمُشْرِكُونَ:" },
          ] },
        { title: "﴿ما ودعك ربك وما قلى﴾", text: "فَأَنْزَلَ اللَّهُ عَزَّ وَجَلَّ: ﴿وَالضُّحَى. وَاللَّيْلِ إِذَا سَجَى. مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَى﴾ [٩٣ /الضحى /١ و٢ و٣].", people: [],
          turns: [
            { text: "فَأَنْزَلَ اللَّهُ عَزَّ وَجَلَّ: ﴿وَالضُّحَى. وَاللَّيْلِ إِذَا سَجَى. مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَى﴾ [٩٣ /الضحى /١ و٢ و٣]." },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theRevelationOfAdDuha;
