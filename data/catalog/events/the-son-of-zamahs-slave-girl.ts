import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Utbah ibn Abi Waqqas charged his brother Sa'd to take the son of Zam'ah's slave girl as his; in the conquest Sa'd brought
 * the boy, Abd ibn Zam'ah said he was his brother born on his father's bed, and the Prophet ﷺ gave him to Abd and told
 * Sawdah «احتجبي منه» for his likeness to Utbah: «الولد للفراش وللعاهر الحجر». Told from Sahih al-Bukhari 4303 (al-Maghazi,
 * the chapter after the conquest), whole. Utbah, Abd ibn Zam'ah and the boy have no catalog subject; Abu Hurayrah is named
 * only as one who used to proclaim it and is not linked.
 */
const theSonOfZamahsSlaveGirl = {
  kind: 'EVENT',
  slug: 'the-son-of-zamahs-slave-girl',
  name: "ابن وليدة زمعة",
  nameTransliterated: "The son of Zam'ah's slave girl",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'saad-ibn-abi-waqqas' }, { person: 'prophet-muhammad' }, { person: 'sawdah-bint-zamah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنِي عَبْدُ اللهِ بْنُ مَسْلَمَةَ، عَنْ مَالِكٍ، عَنِ ابْنِ شِهَابٍ، عَنْ عُرْوَةَ بْنِ الزُّبَيْرِ، عَنْ عَائِشَةَ  رضي الله عنها، عَنِ النَّبِيِّ ﷺ. وَقَالَ اللَّيْثُ: حَدَّثَنِي يُونُسُ، عَنِ ابْنِ شِهَابٍ: أَخْبَرَنِي عُرْوَةُ بْنُ الزُّبَيْرِ: أَنَّ عَائِشَةَ قَالَتْ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4303, url: 'https://sunnah.com/bukhari:4303' },
      moments: [
        { title: "عهد عتبة إلى أخيه سعد", text: "«كَانَ عُتْبَةُ بْنُ أَبِي وَقَّاصٍ عَهِدَ إِلَى أَخِيهِ سَعْدٍ: أَنْ يَقْبِضَ ابْنَ وَلِيدَةِ زَمْعَةَ، وَقَالَ عُتْبَةُ: إِنَّهُ ابْنِي،", people: ['saad-ibn-abi-waqqas'] },
        { title: "«هذا ابن أخي»", text: "فَلَمَّا قَدِمَ رَسُولُ اللهِ ﷺ مَكَّةَ فِي الْفَتْحِ، أَخَذَ سَعْدُ بْنُ أَبِي وَقَّاصٍ ابْنَ وَلِيدَةِ زَمْعَةَ، فَأَقْبَلَ بِهِ إِلَى رَسُولِ اللهِ ﷺ، وَأَقْبَلَ مَعَهُ عَبْدُ بْنُ زَمْعَةَ، فَقَالَ سَعْدُ بْنُ أَبِي وَقَّاصٍ: هَذَا ابْنُ أَخِي، عَهِدَ إِلَيَّ أَنَّهُ ابْنُهُ. قَالَ عَبْدُ بْنُ زَمْعَةَ: يَا رَسُولَ اللهِ، هَذَا أَخِي، هَذَا ابْنُ زَمْعَةَ، وُلِدَ عَلَى فِرَاشِهِ.", people: ['saad-ibn-abi-waqqas', 'prophet-muhammad'] },
        { title: "«احتجبي منه يا سودة»", text: "فَنَظَرَ رَسُولُ اللهِ ﷺ إِلَى ابْنِ وَلِيدَةِ زَمْعَةَ، فَإِذَا أَشْبَهُ النَّاسِ بِعُتْبَةَ بْنِ أَبِي وَقَّاصٍ، فَقَالَ رَسُولُ اللهِ ﷺ: هُوَ لَكَ، هُوَ أَخُوكَ يَا عَبْدَُ بْنَ زَمْعَةَ مِنْ أَجْلِ أَنَّهُ وُلِدَ عَلَى فِرَاشِهِ، وَقَالَ رَسُولُ اللهِ ﷺ: احْتَجِبِي مِنْهُ يَا سَوْدَةُ لِمَا رَأَى مِنْ شَبَهِ عُتْبَةَ بْنِ أَبِي وَقَّاصٍ» قَالَ ابْنُ شِهَابٍ: قَالَتْ عَائِشَةُ: قَالَ رَسُولُ اللهِ ﷺ: الْوَلَدُ لِلْفِرَاشِ وَلِلْعَاهِرِ الْحَجَرُ. وَقَالَ ابْنُ شِهَابٍ: وَكَانَ أَبُو هُرَيْرَةَ يَصِيحُ بِذَلِكَ.", people: ['prophet-muhammad', 'sawdah-bint-zamah'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theSonOfZamahsSlaveGirl;
