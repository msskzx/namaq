import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Abu Ubaydah came back from Bahrain with its jizyah; the Ansar heard and came to the dawn prayer, and the Prophet ﷺ smiled
 * and said «فوالله ما الفقر أخشى عليكم، ولكني أخشى أن تبسط عليكم الدنيا». Told from Sahih al-Bukhari 4015 (al-Maghazi, in
 * the chapters on Badr, for its narrator Amr ibn Awf, a man of Badr), whole.
 */
const theWealthOfBahrain = {
  kind: 'EVENT',
  slug: 'the-wealth-of-bahrain',
  name: "مال البحرين",
  nameTransliterated: "The wealth of Bahrain",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-ubaydah-ibn-al-jarrah' }, { person: 'al-ala-ibn-al-hadrami' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا عَبْدَانُ: أَخْبَرَنَا عَبْدُ اللهِ: أَخْبَرَنَا مَعْمَرٌ وَيُونُسُ، عَنِ الزُّهْرِيِّ، عَنْ عُرْوَةَ بْنِ الزُّبَيْرِ أَنَّهُ أَخْبَرَهُ: أَنَّ الْمِسْوَرَ بْنَ مَخْرَمَةَ أَخْبَرَهُ: أَنَّ عَمْرَو بْنَ عَوْفٍ، وَهُوَ حَلِيفٌ لِبَنِي عَامِرِ بْنِ لُؤَيٍّ، وَكَانَ شَهِدَ بَدْرًا مَعَ النَّبِيِّ ﷺ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4015, url: 'https://sunnah.com/bukhari:4015' },
      moments: [
        { title: "قدم أبو عبيدة بمال من البحرين", text: "«أَنَّ رَسُولَ اللهِ ﷺ بَعَثَ أَبَا عُبَيْدَةَ بْنَ الْجَرَّاحِ إِلَى الْبَحْرَيْنِ يَأْتِي بِجِزْيَتِهَا، وَكَانَ رَسُولُ اللهِ ﷺ هُوَ صَالَحَ أَهْلَ الْبَحْرَيْنِ وَأَمَّرَ عَلَيْهِمُ الْعَلَاءَ بْنَ الْحَضْرَمِيِّ، فَقَدِمَ أَبُو عُبَيْدَةَ بِمَالٍ مِنَ الْبَحْرَيْنِ،", people: ['prophet-muhammad', 'abu-ubaydah-ibn-al-jarrah', 'al-ala-ibn-al-hadrami'] },
        { title: "«أظنكم سمعتم أن أبا عبيدة قدم بشيء؟»", text: "فَسَمِعَتِ الْأَنْصَارُ بِقُدُومِ أَبِي عُبَيْدَةَ، فَوَافَوْا صَلَاةَ الْفَجْرِ مَعَ النَّبِيِّ ﷺ فَلَمَّا انْصَرَفَ تَعَرَّضُوا لَهُ، فَتَبَسَّمَ رَسُولُ اللهِ ﷺ حِينَ رَآهُمْ، ثُمَّ قَالَ: أَظُنُّكُمْ سَمِعْتُمْ أَنَّ أَبَا عُبَيْدَةَ قَدِمَ بِشَيْءٍ؟. قَالُوا: أَجَلْ يَا رَسُولَ اللهِ،", people: ['prophet-muhammad', 'abu-ubaydah-ibn-al-jarrah'] },
        { title: "«فوالله ما الفقر أخشى عليكم»", text: "قَالَ: فَأَبْشِرُوا وَأَمِّلُوا مَا يَسُرُّكُمْ، فَوَاللهِ مَا الْفَقْرَ أَخْشَى عَلَيْكُمْ، وَلَكِنِّي أَخْشَى أَنْ تُبْسَطَ عَلَيْكُمُ الدُّنْيَا، كَمَا بُسِطَتْ عَلَى مَنْ قَبْلَكُمْ، فَتَنَافَسُوهَا كَمَا تَنَافَسُوهَا، وَتُهْلِكَكُمْ كَمَا أَهْلَكَتْهُمْ».", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theWealthOfBahrain;
