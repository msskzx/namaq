import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Abd al-Rahman ibn Awf, fasting, was brought food and remembered Mus'ab ibn Umayr, shrouded in a cloak too short for him,
 * and Hamzah, both better than he, and feared their own good deeds had been paid in this world, and wept until he left the
 * food. Told from Sahih al-Bukhari 4045 (al-Maghazi, the chapter on Uhud), whole.
 */
const abdAlRahmanIbnAwfWeeps = {
  kind: 'EVENT',
  slug: 'abd-al-rahman-ibn-awf-weeps',
  name: "بكاء عبد الرحمن بن عوف",
  nameTransliterated: "Abd al-Rahman ibn Awf weeps",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abdur-rahman-ibn-awf' }, { person: 'musab-ibn-umayr' }, { person: 'hamzah-ibn-abd-al-muttalib' }],
  reports: [
    {
      isnad: "حَدَّثَنَا عَبْدَانُ: حَدَّثَنَا عَبْدُ اللهِ: أَخْبَرَنَا شُعْبَةُ، عَنْ سَعْدِ بْنِ إِبْرَاهِيمَ، عَنْ أَبِيهِ إِبْرَاهِيمَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4045, url: 'https://sunnah.com/bukhari:4045' },
      moments: [
        { title: "«قتل مصعب بن عمير وهو خير مني»", text: "«أَنَّ عَبْدَ الرَّحْمَنِ بْنَ عَوْفٍ أُتِيَ بِطَعَامٍ، وَكَانَ صَائِمًا، فَقَالَ: قُتِلَ مُصْعَبُ بْنُ عُمَيْرٍ وَهْوَ خَيْرٌ مِنِّي، كُفِّنَ فِي بُرْدَةٍ: إِنْ غُطِّيَ رَأْسُهُ بَدَتْ رِجْلَاهُ، وَإِنْ غُطِّيَ رِجْلَاهُ بَدَا رَأْسُهُ،", people: ['abdur-rahman-ibn-awf', 'musab-ibn-umayr'] },
        { title: "«وقد خشينا أن تكون حسناتنا عجلت لنا»", text: "وَأُرَاهُ قَالَ: وَقُتِلَ حَمْزَةُ وَهْوَ خَيْرٌ مِنِّي، ثُمَّ بُسِطَ لَنَا مِنَ الدُّنْيَا مَا بُسِطَ، أَوْ قَالَ: أُعْطِينَا مِنَ الدُّنْيَا مَا أُعْطِينَا، وَقَدْ خَشِينَا أَنْ تَكُونَ حَسَنَاتُنَا عُجِّلَتْ لَنَا، ثُمَّ جَعَلَ يَبْكِي حَتَّى تَرَكَ الطَّعَامَ.»", people: ['hamzah-ibn-abd-al-muttalib', 'abdur-rahman-ibn-awf'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abdAlRahmanIbnAwfWeeps;
