import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Abu Hurayrah carried the Prophet's ﷺ water and was told to bring stones, not bone or dung, because they are the jinn's
 * food: the delegation of the jinn of Nasibin had come and asked him for provision (Sahih al-Bukhari 3860, in Manaqib
 * al-Ansar, whole). al-Dhahabi gives it in brief («فذكر الحديث», al-Sira 1 p162, «أخرجه البخاري»), so it is told from
 * al-Bukhari. Not identified with the night of the jinn or with Nakhlah: the text gives no time, and the commentators'
 * view that the jinn came more than once is theirs, not the text's.
 */
const theJinnOfNasibin = {
  kind: 'EVENT',
  slug: 'the-jinn-of-nasibin',
  name: 'وفد جن نصيبين',
  nameTransliterated: 'The delegation of the jinn of Nasibin',
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abu-hurayrah' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا مُوسَى بْنُ إِسْمَاعِيلَ: حَدَّثَنَا عَمْرُو بْنُ يَحْيَى بْنِ سَعِيدٍ قَالَ: أَخْبَرَنِي جَدِّي، عَنْ أَبِي هُرَيْرَةَ  رضي الله عنه:",
      source: { slug: 'sahih-al-bukhari', hadith: 3860, url: 'https://sunnah.com/bukhari:3860' },
      moments: [
        { title: 'يحمل له الإداوة', text: "«أَنَّهُ كَانَ يَحْمِلُ مَعَ النَّبِيِّ ﷺ إِدَاوَةً لِوَضُوئِهِ وَحَاجَتِهِ، فَبَيْنَمَا هُوَ يَتْبَعُهُ بِهَا، فَقَالَ: مَنْ هَذَا فَقَالَ: أَنَا أَبُو هُرَيْرَةَ،", people: ['abu-hurayrah', 'prophet-muhammad'] },
        { title: '«ولا تأتني بعظم ولا بروثة»', text: "فَقَالَ: ابْغِنِي أَحْجَارًا أَسْتَنْفِضْ بِهَا، وَلَا تَأْتِنِي بِعَظْمٍ وَلَا بِرَوْثَةٍ فَأَتَيْتُهُ بِأَحْجَارٍ أَحْمِلُهَا فِي طَرَفِ ثَوْبِي، حَتَّى وَضَعْتُ إِلَى جَنْبِهِ، ثُمَّ انْصَرَفْتُ،", people: ['prophet-muhammad', 'abu-hurayrah'] },
        { title: '«ما بال العظم والروثة»', text: "حَتَّى إِذَا فَرَغَ مَشَيْتُ، فَقُلْتُ: مَا بَالُ الْعَظْمِ وَالرَّوْثَةِ؟", people: ['abu-hurayrah', 'prophet-muhammad'] },
        { title: '«أتاني وفد جن نصيبين»', text: "قَالَ: هُمَا مِنْ طَعَامِ الْجِنِّ، وَإِنَّهُ أَتَانِي وَفْدُ جِنِّ نَصِيبِينَ، وَنِعْمَ الْجِنُّ، فَسَأَلُونِي الزَّادَ، فَدَعَوْتُ اللهَ لَهُمْ أَنْ لَا يَمُرُّوا بِعَظْمٍ وَلَا بِرَوْثَةٍ إِلَّا وَجَدُوا عَلَيْهَا طَعَامًا.»", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theJinnOfNasibin;
