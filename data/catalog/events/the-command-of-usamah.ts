import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ put Usamah ibn Zayd over an army and people spoke against his command; he stood and said «إن تطعنوا في
 * إمارته فقد كنتم تطعنون في إمارة أبيه من قبل… وإن هذا لمن أحب الناس إلي بعده». Told from Ibn Umar's hadith in Sahih
 * al-Bukhari, each whole: 4469 (al-Maghazi, the sending of Usamah in his last illness) first; then 4250 (the chapter
 * before Umrat al-Qada') and 4468. «أبيه» is Usamah's father, Zayd ibn Harithah, named only as a reference in his words, and is not linked.
 */
const theCommandOfUsamah = {
  kind: 'EVENT',
  slug: 'the-command-of-usamah',
  name: "إمارة أسامة",
  nameTransliterated: "Usamah's command",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'usamah-ibn-zaid' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا إِسْمَاعِيلُ، حَدَّثَنَا مَالِكٌ، عَنْ عَبْدِ اللهِ بْنِ دِينَارٍ، عَنْ عَبْدِ اللهِ بْنِ عُمَرَ  رضي الله عنهما:",
      source: { slug: 'sahih-al-bukhari', hadith: 4469, url: 'https://sunnah.com/bukhari:4469' },
      moments: [
        { title: "فطعن الناس في إمارته", text: "«أَنَّ رَسُولَ اللهِ ﷺ بَعَثَ بَعْثًا، وَأَمَّرَ عَلَيْهِمْ أُسَامَةَ بْنَ زَيْدٍ، فَطَعَنَ النَّاسُ فِي إِمَارَتِهِ،", people: ['prophet-muhammad', 'usamah-ibn-zaid'] },
        { title: "«إن تطعنوا في إمارته»", text: "فَقَامَ رَسُولُ اللهِ ﷺ فَقَالَ: إِنْ تَطْعَُنُوا فِي إِمَارَتِهِ فَقَدْ كُنْتُمْ تَطْعَنُونَ فِي إِمَارَةِ أَبِيهِ مِنْ قَبْلُ، وَايْمُ اللهِ إِنْ كَانَ لَخَلِيقًا لِلْإِمَارَةِ، وَإِنْ كَانَ لَمِنْ أَحَبِّ النَّاسِ إِلَيَّ، وَإِنَّ هَذَا لَمِنْ أَحَبِّ النَّاسِ إِلَيَّ بَعْدَهُ».", people: ['prophet-muhammad', 'usamah-ibn-zaid'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا مُسَدَّدٌ: حَدَّثَنَا يَحْيَى بْنُ سَعِيدٍ: حَدَّثَنَا سُفْيَانُ بْنُ سَعِيدٍ: حَدَّثَنَا عَبْدُ اللهِ بْنُ دِينَارٍ، عَنِ ابْنِ عُمَرَ  رضي الله عنهما قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4250, url: 'https://sunnah.com/bukhari:4250' },
      moments: [
        { title: "«إن تطعنوا في إمارته»", text: "«أَمَّرَ رَسُولُ اللهِ ﷺ أُسَامَةَ عَلَى قَوْمٍ فَطَعَنُوا فِي إِمَارَتِهِ، فَقَالَ: إِنْ تَطْعَنُوا فِي إِمَارَتِهِ فَقَدْ طَعَنْتُمْ فِي إِمَارَةِ أَبِيهِ مِنْ قَبْلِهِ، وَايْمُ اللهِ لَقَدْ كَانَ خَلِيقًا لِلْإِمَارَةِ، وَإِنْ كَانَ مِنْ أَحَبِّ النَّاسِ إِلَيَّ، وَإِنَّ هَذَا لَمِنْ أَحَبِّ النَّاسِ إِلَيَّ بَعْدَهُ.»", people: ['prophet-muhammad', 'usamah-ibn-zaid'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا أَبُو عَاصِمٍ الضَّحَّاكُ بْنُ مَخْلَدٍ، عَنِ الْفُضَيْلِ بْنِ سُلَيْمَانَ، حَدَّثَنَا مُوسَى بْنُ عُقْبَةَ، عَنْ سَالِمٍ، عَنْ أَبِيهِ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4468, url: 'https://sunnah.com/bukhari:4468' },
      moments: [
        { title: "«وإنه أحب الناس إلي»", text: "«اسْتَعْمَلَ النَّبِيُّ ﷺ أُسَامَةَ، فَقَالُوا فِيهِ، فَقَالَ النَّبِيُّ ﷺ: قَدْ بَلَغَنِي أَنَّكُمْ قُلْتُمْ فِي أُسَامَةَ، وَإِنَّهُ أَحَبُّ النَّاسِ إِلَيَّ.»", people: ['prophet-muhammad', 'usamah-ibn-zaid'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theCommandOfUsamah;
