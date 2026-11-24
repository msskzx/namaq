import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At Uhud the Prophet ﷺ set the archers under Abd Allah and told them not to move whatever happened; when the mushrikun fled
 * they went for the spoils, and seventy were killed; Abu Sufyan called out for Muhammad, Ibn Abi Quhafah and Ibn al-Khattab,
 * and the Prophet ﷺ had them answer «الله أعلى وأجل» and «الله مولانا ولا مولى لكم». Told from Sahih al-Bukhari 4043
 * (al-Maghazi, the chapter on Uhud), whole. The archers' leader is named only «عبد الله» here and is not linked.
 */
const theArchersAndAbuSufyanAtUhud = {
  kind: 'EVENT',
  slug: 'the-archers-and-abu-sufyan-at-uhud',
  name: "الرماة وأبو سفيان يوم أحد",
  nameTransliterated: "The archers and Abu Sufyan at Uhud",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-sufyan-ibn-harb' }, { person: 'abu-bakr-as-siddiq' }, { person: 'umar-ibn-al-khattab' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4043, 0, 116),
      source: { slug: 'sahih-al-bukhari', hadith: 4043, url: 'https://sunnah.com/bukhari:4043' },
      moments: [
        { title: "«لا تبرحوا»", text: sahih('bukhari', 4043, 117, 382), people: ['prophet-muhammad'] },
        { title: "«الغنيمة الغنيمة»", text: sahih('bukhari', 4043, 383, 717), people: ['prophet-muhammad'] },
        { title: "«أفي القوم محمد؟»", text: sahih('bukhari', 4043, 718, 1101), people: ['abu-sufyan-ibn-harb', 'prophet-muhammad', 'abu-bakr-as-siddiq', 'umar-ibn-al-khattab'] },
        { title: "«الله أعلى وأجل»", text: sahih('bukhari', 4043, 1102, 1407), people: ['abu-sufyan-ibn-harb', 'prophet-muhammad'] },
        { title: "«يوم بيوم بدر»", text: sahih('bukhari', 4043, 1408, 1533), people: ['abu-sufyan-ibn-harb'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theArchersAndAbuSufyanAtUhud;
