import type { CatalogEvent } from '@/lib/catalog/types';

// At Mecca, قبل مخرج النبي صلى الله عليه وسلم to Medina, which dates it before
// the hijra and to no year the model can hold.
//
// Told as a story from Sahih al-Bukhari, each hadith whole (Manaqib al-Ansar, the chapter on the splitting of the moon): Ibn Mas'ud's
// 3869 first, then Anas's 3868 and Ibn Abbas's 3870. 3871 is 3869's chain cut to «انشق القمر» and is not repeated.
const splittingOfTheMoon = {
  kind: 'EVENT',
  slug: 'splitting-of-the-moon',
  name: 'انشقاق القمر',
  nameTransliterated: 'The Splitting of the Moon',
  type: 'OTHER',
  fields: {
    description: {
      value:
        'سأل أهل مكة النبي صلى الله عليه وسلم أن يريهم آية، فانشق القمر فرقتين، شقة على أبي قبيس وشقة على السويداء، فقال: اشهدوا. وفيه نزل: {اقْتَرَبَتِ السَّاعَةُ وَانْشَقَّ الْقَمَرُ} .',
      claims: ['sira/splitting-moon'],
    },
  },
  people: [{ person: 'prophet-muhammad', claims: ['sira/splitting-moon'] }, { person: 'abdullah-ibn-masud' }],
  reports: [
    {
      isnad: "حَدَّثَنَا عَبْدَانُ، عَنْ أَبِي حَمْزَةَ، عَنِ الْأَعْمَشِ، عَنْ إِبْرَاهِيمَ، عَنْ أَبِي مَعْمَرٍ، عَنْ عَبْدِ اللهِ  رضي الله عنه",
      source: { slug: 'sahih-al-bukhari', hadith: 3869, url: 'https://sunnah.com/bukhari:3869' },
      moments: [
        { title: "انشق ونحن معه بمنى", text: "قَالَ: «انْشَقَّ الْقَمَرُ وَنَحْنُ مَعَ النَّبِيِّ ﷺ بِمِنًى،", people: ['abdullah-ibn-masud', 'prophet-muhammad'] },
        { title: "«اشهدوا»", text: "فَقَالَ: اشْهَدُوا وَذَهَبَتْ فِرْقَةٌ نَحْوَ الْجَبَلِ.»", people: ['prophet-muhammad'] },
        { title: "«انشق بمكة»", text: "وَقَالَ أَبُو الضُّحَى، عَنْ مَسْرُوقٍ، عَنْ عَبْدِ اللهِ: انْشَقَّ بِمَكَّةَ. وَتَابَعَهُ مُحَمَّدُ بْنُ مُسْلِمٍ، عَنِ ابْنِ أَبِي نَجِيحٍ، عَنْ مُجَاهِدٍ، عَنْ أَبِي مَعْمَرٍ، عَنْ عَبْدِ اللهِ.", people: ['abdullah-ibn-masud'] },
      ],
    },
    {
      isnad: "حَدَّثَنِي عَبْدُ اللهِ بْنُ عَبْدِ الْوَهَّابِ: حَدَّثَنَا بِشْرُ بْنُ الْمُفَضَّلِ: حَدَّثَنَا سَعِيدُ بْنُ أَبِي عَرُوبَةَ، عَنْ قَتَادَةَ، عَنْ أَنَسِ بْنِ مَالِكٍ  رضي الله عنه:",
      source: { slug: 'sahih-al-bukhari', hadith: 3868, url: 'https://sunnah.com/bukhari:3868' },
      moments: [
        { title: "سألوه أن يريهم آية", text: "«أَنَّ أَهْلَ مَكَّةَ سَأَلُوا رَسُولَ اللهِ ﷺ أَنْ يُرِيَهُمْ آيَةً،", people: ['prophet-muhammad'] },
        { title: "حتى رأوا حراء بينهما", text: "فَأَرَاهُمُ الْقَمَرَ شِقَّتَيْنِ، حَتَّى رَأَوْا حِرَاءً بَيْنَهُمَا.»", people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا عُثْمَانُ بْنُ صَالِحٍ: حَدَّثَنَا بَكْرُ بْنُ مُضَرَ قَالَ: حَدَّثَنِي جَعْفَرُ بْنُ رَبِيعَةَ، عَنْ عِرَاكِ بْنِ مَالِكٍ، عَنْ عُبَيْدِ اللهِ بْنِ عَبْدِ اللهِ بْنِ عُتْبَةَ بْنِ مَسْعُودٍ، عَنْ عَبْدِ اللهِ بْنِ عَبَّاسٍ  رضي الله عنهما:",
      source: { slug: 'sahih-al-bukhari', hadith: 3870, url: 'https://sunnah.com/bukhari:3870' },
      moments: [
        { title: "على زمان رسول الله ﷺ", text: "«أَنَّ الْقَمَرَ انْشَقَّ عَلَى زَمَانِ رَسُولِ اللهِ ﷺ.»", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default splittingOfTheMoon;
