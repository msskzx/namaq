import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Umm Khalid came back from Abyssinia a little girl, and the Prophet ﷺ clothed her in a khamisah with markings, stroking
 * them and saying «سناه سناه». Told from Sahih al-Bukhari 3874 (the chapter on the hijra to Abyssinia), whole, with
 * al-Humaydi's gloss.
 */
const ummKhalidAndTheKhamisah = {
  kind: 'EVENT',
  slug: 'umm-khalid-and-the-khamisah',
  name: "أم خالد وخميصة النبي ﷺ",
  nameTransliterated: "Umm Khalid and the Prophet's khamisah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'umm-khalid-bint-khalid' }, { person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: "حَدَّثَنَا الْحُمَيْدِيُّ: حَدَّثَنَا سُفْيَانُ: حَدَّثَنَا إِسْحَاقُ بْنُ سَعِيدٍ السَّعِيدِيُّ، عَنْ أَبِيهِ، عَنْ أُمِّ خَالِدٍ بِنْتِ خَالِدٍ",
      source: { slug: 'sahih-al-bukhari', hadith: 3874, url: 'https://sunnah.com/bukhari:3874' },
      moments: [
        { title: "قدمت من الحبشة جويرية", text: "قَالَتْ: «قَدِمْتُ مِنْ أَرْضِ الْحَبَشَةِ وَأَنَا جُوَيْرِيَةٌ،", people: ['umm-khalid-bint-khalid'] },
        { title: "«سناه سناه»", text: "فَكَسَانِي رَسُولُ اللهِ ﷺ خَمِيصَةً لَهَا أَعْلَامٌ، فَجَعَلَ رَسُولُ اللهِ ﷺ يَمْسَحُ الْأَعْلَامَ بِيَدِهِ وَيَقُولُ: سَنَاهْ سَنَاهْ.»", people: ['prophet-muhammad', 'umm-khalid-bint-khalid'] },
        { title: "يعني حسن حسن", text: "قَالَ الْحُمَيْدِيُّ: يَعْنِي حَسَنٌ حَسَنٌ.", people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default ummKhalidAndTheKhamisah;
