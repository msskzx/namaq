import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Sahl ibn Sa'd, asked about the Prophet's wound, said Fatimah washed it and Ali poured water from his shield, and when the
 * blood would not stop she burned a piece of mat and pressed it on; that day his tooth was broken, his face wounded and the
 * helmet broken on his head. Told from Sahih al-Bukhari 4075 (al-Maghazi, in the chapters on Uhud), whole.
 */
const theWoundOfTheProphetAtUhud = {
  kind: 'EVENT',
  slug: 'the-wound-of-the-prophet-at-uhud',
  name: "جرح النبي ﷺ يوم أحد",
  nameTransliterated: "The Prophet's wound at Uhud",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'fatimah-bint-muhammad' }, { person: 'ali-ibn-abi-talib' }],
  reports: [
    {
      isnad: "حَدَّثَنَا قُتَيْبَةُ بْنُ سَعِيدٍ: حَدَّثَنَا يَعْقُوبُ، عَنْ أَبِي حَازِمٍ: أَنَّهُ",
      source: { slug: 'sahih-al-bukhari', hadith: 4075, url: 'https://sunnah.com/bukhari:4075' },
      moments: [
        { title: "من كان يغسل جرح رسول الله ﷺ", text: "«سَمِعَ سَهْلَ بْنَ سَعْدٍ، وَهُوَ يُسْأَلُ عَنْ جُرْحِ رَسُولِ اللهِ ﷺ، فَقَالَ: أَمَا وَاللهِ إِنِّي لَأَعْرِفُ مَنْ كَانَ يَغْسِلُ جُرْحَ رَسُولِ اللهِ ﷺ، وَمَنْ كَانَ يَسْكُبُ الْمَاءَ، وَبِمَا دُووِيَ،", people: ['prophet-muhammad'] },
        { title: "أخذت قطعة من حصير فأحرقتها", text: "قَالَ: كَانَتْ فَاطِمَةُ عليها السلام بِنْتُ رَسُولِ اللهِ ﷺ تَغْسِلُهُ، وَعَلِيٌّ يَسْكُبُ الْمَاءَ بِالْمِجَنِّ، فَلَمَّا رَأَتْ فَاطِمَةُ أَنَّ الْمَاءَ لَا يَزِيدُ الدَّمَ إِلَّا كَثْرَةً، أَخَذَتْ قِطْعَةً مِنْ حَصِيرٍ، فَأَحْرَقَتْهَا وَأَلْصَقَتْهَا، فَاسْتَمْسَكَ الدَّمُ، وَكُسِرَتْ رَبَاعِيَتُهُ يَوْمَئِذٍ، وَجُرِحَ وَجْهُهُ، وَكُسِرَتِ الْبَيْضَةُ عَلَى رَأْسِهِ.»", people: ['fatimah-bint-muhammad', 'prophet-muhammad', 'ali-ibn-abi-talib'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theWoundOfTheProphetAtUhud;
