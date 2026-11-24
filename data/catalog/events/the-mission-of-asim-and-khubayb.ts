import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ sent ten scouts under Asim ibn Thabit; Banu Lihyan of Hudhayl tracked them by their date stones and
 * surrounded them, Asim refused to come down on a disbeliever's pledge and was killed, and Khubayb and Zayd ibn al-Dathinah
 * were sold in Makkah; Khubayb, held by Banu al-Harith, spared their child, was seen eating grapes in chains, prayed two
 * rak'ahs before he was killed and spoke his lines, and hornets kept Quraysh from Asim's body. Told from Sahih al-Bukhari
 * 3989 (al-Maghazi, in the chapters on Badr), whole, with Ka'b ibn Malik's line that ends it (he is linked on that line,
 * which names him). Asim, the third man, Abu Sirwa'ah, al-Harith ibn Amir, Murarah ibn al-Rabi' and Hilal ibn Umayyah have
 * no catalog subject and are not linked.
 * Then Abu Hurayrah's other route, 4086 (al-Maghazi, the chapter on al-Raji'), whole, folded; Uqbah ibn al-Harith, who
 * kills Khubayb there, has no catalog subject and is not linked.
 */
const theMissionOfAsimAndKhubayb = {
  kind: 'EVENT',
  slug: 'the-mission-of-asim-and-khubayb',
  name: "بعث عاصم بن ثابت وخبيب",
  nameTransliterated: "The scouts of Asim ibn Thabit and Khubayb",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'khubayb-ibn-adi' }, { person: 'zayd-ibn-al-dathinah' }, { person: 'kaab-ibn-malik' }],
  reports: [
    {
      isnad: sahih('bukhari', 3989, 0, 265),
      source: { slug: 'sahih-al-bukhari', hadith: 3989, url: 'https://sunnah.com/bukhari:3989' },
      moments: [
        { title: "بعث عشرة عينا", text: sahih('bukhari', 3989, 266, 704), people: ['prophet-muhammad'] },
        { title: "«لا أنزل في ذمة كافر»", text: sahih('bukhari', 3989, 705, 1146), people: ['prophet-muhammad'] },
        { title: "«هذا أول الغدر»", text: sahih('bukhari', 3989, 1147, 1544), people: ['khubayb-ibn-adi', 'zayd-ibn-al-dathinah'] },
        { title: "باعوهما بعد وقعة بدر", text: sahih('bukhari', 3989, 1545, 1836), people: ['khubayb-ibn-adi', 'zayd-ibn-al-dathinah'] },
        { title: "«ما رأيت أسيرا قط خيرا من خبيب»", text: sahih('bukhari', 3989, 1837, 2425), people: ['khubayb-ibn-adi'] },
        { title: "«دعوني أصلي ركعتين»", text: sahih('bukhari', 3989, 2426, 2949), people: ['khubayb-ibn-adi'] },
        { title: "سن لكل مسلم قتل صبرا الصلاة", text: sahih('bukhari', 3989, 2950, 3148), people: ['khubayb-ibn-adi'] },
        { title: "مثل الظلة من الدبر", text: sahih('bukhari', 3989, 3149, 3464), people: [] },
        { title: "«رجلين صالحين قد شهدا بدرا»", text: sahih('bukhari', 3989, 3465, 3629), people: ['kaab-ibn-malik'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4086, 0, 195),
      source: { slug: 'sahih-al-bukhari', hadith: 4086, url: 'https://sunnah.com/bukhari:4086' },
      moments: [
        { title: "بعث سرية عينا", text: sahih('bukhari', 4086, 196, 697), people: ['prophet-muhammad'] },
        { title: "«أما أنا فلا أنزل في ذمة كافر»", text: sahih('bukhari', 4086, 698, 1080), people: ['prophet-muhammad'] },
        { title: "«هذا أول الغدر»", text: sahih('bukhari', 4086, 1081, 1490), people: ['khubayb-ibn-adi', 'zayd-ibn-al-dathinah'] },
        { title: "باعوهما بمكة", text: sahih('bukhari', 4086, 1491, 1705), people: ['khubayb-ibn-adi', 'zayd-ibn-al-dathinah'] },
        { title: "«ما رأيت أسيرا قط خيرا من خبيب»", text: sahih('bukhari', 4086, 1706, 2316), people: ['khubayb-ibn-adi'] },
        { title: "«دعوني أصلي ركعتين»", text: sahih('bukhari', 4086, 2317, 2855), people: ['khubayb-ibn-adi'] },
        { title: "مثل الظلة من الدبر", text: sahih('bukhari', 4086, 2856, 3131), people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theMissionOfAsimAndKhubayb;
