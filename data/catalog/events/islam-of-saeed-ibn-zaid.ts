import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Sa'id ibn Zayd, in the mosque of Kufah: Umar had him bound over Islam, him and Umar's sister, before Umar became Muslim;
 * and Uhud would have had the right to fall for what they did to Uthman. Told from Sahih al-Bukhari, each hadith whole:
 * 3867 (the chapter on Umar's islam) first, as it names the sister too, then 3862 (the chapter on Sa'id's own islam). Umar's
 * sister has no catalog subject and is not linked. Umar's own islam is islam-of-umar.ts.
 */
const islamOfSaeedIbnZaid = {
  kind: 'EVENT',
  slug: 'islam-of-saeed-ibn-zaid',
  name: "إسلام سعيد بن زيد",
  nameTransliterated: "The Islam of Sa'id ibn Zayd",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'saeed-ibn-zaid' }, { person: 'umar-ibn-al-khattab' }, { person: 'uthman-ibn-affan' }],
  tags: ['ISLAM'],
  reports: [
    {
      isnad: "حَدَّثَنِي مُحَمَّدُ بْنُ الْمُثَنَّى: حَدَّثَنَا يَحْيَى: حَدَّثَنَا إِسْمَاعِيلُ: حَدَّثَنَا قَيْسٌ",
      source: { slug: 'sahih-al-bukhari', hadith: 3867, url: 'https://sunnah.com/bukhari:3867' },
      moments: [
        { title: "«موثقي عمر على الإسلام»", text: "قَالَ: سَمِعْتُ سَعِيدَ بْنَ زَيْدٍ يَقُولُ لِلْقَوْمِ: «لَوْ رَأَيْتُنِي مُوثِقِي عُمَرُ عَلَى الْإِسْلَامِ، أَنَا وَأُخْتُهُ، وَمَا أَسْلَمَ،", people: ['saeed-ibn-zaid', 'umar-ibn-al-khattab'] },
        { title: "«لما صنعتم بعثمان»", text: "وَلَوْ أَنَّ أُحُدًا انْقَضَّ لِمَا صَنَعْتُمْ بِعُثْمَانَ، لَكَانَ مَحْقُوقًا أَنْ يَنْقَضَّ».", people: ['saeed-ibn-zaid', 'uthman-ibn-affan'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا قُتَيْبَةُ بْنُ سَعِيدٍ: حَدَّثَنَا سُفْيَانُ، عَنْ إِسْمَاعِيلَ،  عَنْ قَيْسٍ",
      source: { slug: 'sahih-al-bukhari', hadith: 3862, url: 'https://sunnah.com/bukhari:3862' },
      moments: [
        { title: "«وإن عمر لموثقي على الإسلام»", text: "قَالَ: سَمِعْتُ سَعِيدَ بْنَ زَيْدِ بْنِ عَمْرِو بْنِ نُفَيْلٍ فِي مَسْجِدِ الْكُوفَةِ يَقُولُ: «وَاللهِ لَقَدْ رَأَيْتُنِي، وَإِنَّ عُمَرَ لَمُوثِقِي عَلَى الْإِسْلَامِ، قَبْلَ أَنْ يُسْلِمَ عُمَرُ،", people: ['saeed-ibn-zaid', 'umar-ibn-al-khattab'] },
        { title: "«للذي صنعتم بعثمان»", text: "وَلَوْ أَنَّ أُحُدًا ارْفَضَّ لِلَّذِي صَنَعْتُمْ بِعُثْمَانَ لَكَانَ».", people: ['saeed-ibn-zaid', 'uthman-ibn-affan'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default islamOfSaeedIbnZaid;
