import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Al-Aqib and al-Sayyid of Najran came meaning to call down a curse with the Prophet ﷺ, thought better of it and offered
 * what he asked, asking him to send a trustworthy man with them; the Companions hoped for it, and he said «قم يا أبا عبيدة
 * بن الجراح… هذا أمين هذه الأمة». Told from Hudhayfah's hadith in Sahih al-Bukhari (al-Maghazi, the story of the people
 * of Najran), each whole: 4380 first, then 4381. 4382 is the saying alone. Al-Aqib and al-Sayyid have no catalog subject.
 */
const thePeopleOfNajran = {
  kind: 'EVENT',
  slug: 'the-people-of-najran',
  name: "أهل نجران",
  nameTransliterated: "The people of Najran",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-ubaydah-ibn-al-jarrah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنِي عَبَّاسُ بْنُ   الْحُسَيْنِ: حَدَّثَنَا يَحْيَى بْنُ آدَمَ، عَنْ إِسْرَائِيلَ، عَنْ أَبِي إِسْحَاقَ، عَنْ صِلَةَ بْنِ زُفَرَ، عَنْ حُذَيْفَةَ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4380, url: 'https://sunnah.com/bukhari:4380' },
      moments: [
        { title: "يريدان أن يلاعناه", text: "«جَاءَ الْعَاقِبُ وَالسَّيِّدُ، صَاحِبَا نَجْرَانَ، إِلَى رَسُولِ اللهِ ﷺ يُرِيدَانِ أَنْ يُلَاعِنَاهُ، قَالَ: فَقَالَ أَحَدُهُمَا لِصَاحِبِهِ: لَا تَفْعَلْ، فَوَاللهِ لَئِنْ كَانَ نَبِيًّا فَلَاعَنَّا لَا نُفْلِحُ نَحْنُ وَلَا عَقِبُنَا مِنْ بَعْدِنَا، قَالَا: إِنَّا نُعْطِيكَ مَا سَأَلْتَنَا، وَابْعَثْ مَعَنَا رَجُلًا أَمِينًا، وَلَا تَبْعَثْ مَعَنَا إِلَّا أَمِينًا.", people: ['prophet-muhammad'] },
        { title: "«هذا أمين هذه الأمة»", text: "فَقَالَ: لَأَبْعَثَنَّ مَعَكُمْ رَجُلًا أَمِينًا حَقَّ أَمِينٍ، فَاسْتَشْرَفَ لَهُ أَصْحَابُ رَسُولِ اللهِ ﷺ، فَقَالَ: قُمْ يَا أَبَا عُبَيْدَةَ بْنَ الْجَرَّاحِ، فَلَمَّا قَامَ، قَالَ رَسُولُ اللهِ ﷺ: هَذَا أَمِينُ هَذِهِ الْأُمَّةِ».", people: ['prophet-muhammad', 'abu-ubaydah-ibn-al-jarrah'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا مُحَمَّدُ بْنُ بَشَّارٍ: حَدَّثَنَا مُحَمَّدُ بْنُ جَعْفَرٍ: حَدَّثَنَا شُعْبَةُ قَالَ: سَمِعْتُ أَبَا إِسْحَاقَ، عَنْ صِلَةَ بْنِ زُفَرَ، عَنْ حُذَيْفَةَ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4381, url: 'https://sunnah.com/bukhari:4381' },
      moments: [
        { title: "«لأبعثن إليكم رجلا أمينا حق أمين»", text: "«جَاءَ أَهْلُ نَجْرَانَ إِلَى النَّبِيِّ ﷺ، فَقَالُوا: ابْعَثْ لَنَا رَجُلًا أَمِينًا، فَقَالَ: لَأَبْعَثَنَّ إِلَيْكُمْ رَجُلًا أَمِينًا حَقَّ أَمِينٍ، فَاسْتَشْرَفَ لَهُ النَّاسُ، فَبَعَثَ أَبَا عُبَيْدَةَ بْنَ الْجَرَّاحِ.»", people: ['prophet-muhammad', 'abu-ubaydah-ibn-al-jarrah'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default thePeopleOfNajran;
