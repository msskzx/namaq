import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ sent Ali with al-Zubayr and al-Miqdad (in 3983, Abu Marthad and al-Zubayr) to Rawdat Khakh after a woman
 * carrying a letter from Hatib ibn Abi Balta'ah to the mushrikun of Makkah; they brought it back, Hatib gave his reason, Umar
 * asked to strike his neck, and the Prophet ﷺ said «إنه قد شهد بدرا… اعملوا ما شئتم فقد غفرت لكم», and the opening of
 * al-Mumtahanah was sent down. Told first from Sahih al-Bukhari 4274 (al-Maghazi, the chapter on the conquest of Makkah),
 * whole: it is a little the fuller and the only one that gives the ayah sent down; then 3983 (the virtue of those who were
 * at Badr), whole. Abu Marthad has no catalog subject and is not linked. Another telling in the book (3007) falls outside
 * the sira batches.
 */
const theLetterOfHatib = {
  kind: 'EVENT',
  slug: 'the-letter-of-hatib',
  name: "كتاب حاطب بن أبي بلتعة",
  nameTransliterated: "Hatib ibn Abi Balta'ah's letter",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'ali-ibn-abi-talib' }, { person: 'az-zubayr-ibn-al-awwam' }, { person: 'prophet-muhammad' }, { person: 'hatib-ibn-abi-baltaah' }, { person: 'umar-ibn-al-khattab' }, { person: 'al-miqdad-ibn-amr' }],
  tags: ['HIS_WORDS', 'REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '60:1',
      to: '60:1',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4274, url: 'https://sunnah.com/bukhari:4274', quote: sahih('bukhari', 4274, 1640, 1837) }],
    },
  ],
  reports: [
    {
      isnad: sahih('bukhari', 4274, 0, 214),
      source: { slug: 'sahih-al-bukhari', hadith: 4274, url: 'https://sunnah.com/bukhari:4274' },
      moments: [
        { title: "«انطلقوا حتى تأتوا روضة خاخ»", text: sahih('bukhari', 4274, 215, 389), people: ['prophet-muhammad', 'ali-ibn-abi-talib', 'az-zubayr-ibn-al-awwam', 'al-miqdad-ibn-amr'] },
        { title: "«لتخرجن الكتاب»", text: sahih('bukhari', 4274, 390, 669), people: ['ali-ibn-abi-talib', 'az-zubayr-ibn-al-awwam', 'al-miqdad-ibn-amr'] },
        { title: "من حاطب بن أبي بلتعة", text: sahih('bukhari', 4274, 670, 842), people: ['prophet-muhammad', 'hatib-ibn-abi-baltaah'] },
        { title: "«يا حاطب، ما هذا؟»", text: sahih('bukhari', 4274, 843, 1347), people: ['prophet-muhammad', 'hatib-ibn-abi-baltaah'] },
        { title: "«اعملوا ما شئتم فقد غفرت لكم»", text: sahih('bukhari', 4274, 1348, 1639), people: ['prophet-muhammad', 'umar-ibn-al-khattab'] },
        { title: "فأنزل الله السورة", text: sahih('bukhari', 4274, 1640, 1839), people: [] },
      ],
    },
    {
      isnad: sahih('bukhari', 3983, 0, 236),
      source: { slug: 'sahih-al-bukhari', hadith: 3983, url: 'https://sunnah.com/bukhari:3983' },
      moments: [
        { title: "«انطلقوا حتى تأتوا روضة خاخ»", text: sahih('bukhari', 3983, 237, 484), people: ['ali-ibn-abi-talib', 'az-zubayr-ibn-al-awwam', 'prophet-muhammad', 'hatib-ibn-abi-baltaah'] },
        { title: "«ما كذب رسول الله ﷺ»", text: sahih('bukhari', 3983, 485, 853), people: ['prophet-muhammad'] },
        { title: "«دعني فلأضرب عنقه»", text: sahih('bukhari', 3983, 854, 1012), people: ['prophet-muhammad', 'umar-ibn-al-khattab'] },
        { title: "«ما حملك على ما صنعت»", text: sahih('bukhari', 3983, 1013, 1427), people: ['prophet-muhammad', 'hatib-ibn-abi-baltaah'] },
        { title: "«لعل الله اطلع إلى أهل بدر»", text: sahih('bukhari', 3983, 1428, 1783), people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theLetterOfHatib;
