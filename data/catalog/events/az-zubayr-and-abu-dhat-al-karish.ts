import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At Badr al-Zubayr met Ubaydah ibn Sa'id ibn al-As, armoured to the eyes, and killed him with a thrust of his short spear
 * through the eye; the Prophet ﷺ asked for the spear, and after him Abu Bakr, Umar and Uthman each had it in turn. Told from
 * Sahih al-Bukhari 3998 (al-Maghazi, in the chapters on Badr), whole. Ubaydah ibn Sa'id and Abd Allah ibn al-Zubayr have no
 * catalog subject and are not linked; nor is the family of Ali, named only as «آل علي».
 */
const azZubayrAndAbuDhatAlKarish = {
  kind: 'EVENT',
  slug: 'az-zubayr-and-abu-dhat-al-karish',
  name: "الزبير وأبو ذات الكرش",
  nameTransliterated: "Al-Zubayr and Abu Dhat al-Karish",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'az-zubayr-ibn-al-awwam' }, { person: 'prophet-muhammad' }, { person: 'abu-bakr-as-siddiq' }, { person: 'umar-ibn-al-khattab' }, { person: 'uthman-ibn-affan' }],
  reports: [
    {
      isnad: "حَدَّثَنِي عُبَيْدُ بْنُ إِسْمَاعِيلَ: حَدَّثَنَا أَبُو أُسَامَةَ، عَنْ هِشَامِ بْنِ عُرْوَةَ، عَنْ أَبِيهِ قَالَ: قَالَ الزُّبَيْرُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 3998, url: 'https://sunnah.com/bukhari:3998' },
      moments: [
        { title: "«أنا أبو ذات الكرش»", text: "«لَقِيتُ يَوْمَ بَدْرٍ عُبَيْدَةَ بْنَ سَعِيدِ بْنِ الْعَاصِ، وَهُوَ مُدَجَّجٌ، لَا يُرَى مِنْهُ إِلَّا عَيْنَاهُ، وَهُوَ يُكْنَى أَبُو ذَاتِ الْكَرِشِ، فَقَالَ أَنَا أَبُو ذَاتِ الْكَرِشِ، فَحَمَلْتُ عَلَيْهِ بِالْعَنَزَةِ فَطَعَنْتُهُ فِي عَيْنِهِ فَمَاتَ.", people: ['az-zubayr-ibn-al-awwam'] },
        { title: "انثنى طرفاها", text: "قَالَ هِشَامٌ: فَأُخْبِرْتُ: أَنَّ الزُّبَيْرَ قَالَ: لَقَدْ وَضَعْتُ رِجْلِي عَلَيْهِ، ثُمَّ تَمَطَّأْتُ، فَكَانَ الْجَهْدَ أَنْ نَزَعْتُهَا وَقَدِ انْثَنَى طَرَفَاهَا.", people: ['az-zubayr-ibn-al-awwam'] },
        { title: "فسأله إياها رسول الله ﷺ", text: "قَالَ عُرْوَةُ: فَسَأَلَهُ إِيَّاهَا رَسُولُ اللهِ ﷺ فَأَعْطَاهُ، فَلَمَّا قُبِضَ رَسُولُ اللهِ ﷺ أَخَذَهَا، ثُمَّ طَلَبَهَا أَبُو بَكْرٍ فَأَعْطَاهُ، فَلَمَّا قُبِضَ أَبُو بَكْرٍ سَأَلَهَا إِيَّاهُ عُمَرُ فَأَعْطَاهُ إِيَّاهَا، فَلَمَّا قُبِضَ عُمَرُ أَخَذَهَا، ثُمَّ طَلَبَهَا عُثْمَانُ مِنْهُ فَأَعْطَاهُ إِيَّاهَا، فَلَمَّا قُتِلَ عُثْمَانُ وَقَعَتْ عِنْدَ آلِ عَلِيٍّ، فَطَلَبَهَا عَبْدُ اللهِ بْنُ الزُّبَيْرِ، فَكَانَتْ عِنْدَهُ حَتَّى قُتِلَ».", people: ['prophet-muhammad', 'az-zubayr-ibn-al-awwam', 'abu-bakr-as-siddiq', 'umar-ibn-al-khattab', 'uthman-ibn-affan'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default azZubayrAndAbuDhatAlKarish;
