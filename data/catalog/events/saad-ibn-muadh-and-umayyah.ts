import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Sa'd ibn Mu'adh, staying with his friend Umayyah ibn Khalaf at Makkah for umrah after the Prophet ﷺ came to Medina, faced
 * down Abu Jahl at the Ka'bah and told Umayyah he had heard the Prophet ﷺ say «إنهم قاتلوك»; Umayyah swore not to leave
 * Makkah, was talked into going out to Badr by Abu Jahl, and was killed there. Told from Sahih al-Bukhari 3950 (al-Maghazi,
 * the chapter on those killed at Badr as the Prophet ﷺ foretold), whole.
 */
const saadIbnMuadhAndUmayyah = {
  kind: 'EVENT',
  slug: 'saad-ibn-muadh-and-umayyah',
  name: "سعد بن معاذ وأمية بن خلف",
  nameTransliterated: "Sa'd ibn Mu'adh and Umayyah ibn Khalaf",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'saad-ibn-muadh' }, { person: 'umayyah-ibn-khalaf' }, { person: 'prophet-muhammad' }, { person: 'abu-jahl-ibn-hisham' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 3950, 0, 293),
      source: { slug: 'sahih-al-bukhari', hadith: 3950, url: 'https://sunnah.com/bukhari:3950' },
      moments: [
        { title: "نزل على أمية بمكة", text: sahih('bukhari', 3950, 294, 704), people: ['saad-ibn-muadh', 'umayyah-ibn-khalaf', 'prophet-muhammad'] },
        { title: "«ألا أراك تطوف بمكة آمنا»", text: sahih('bukhari', 3950, 705, 1045), people: ['abu-jahl-ibn-hisham', 'saad-ibn-muadh', 'umayyah-ibn-khalaf'] },
        { title: "«طريقك على المدينة»", text: sahih('bukhari', 3950, 1046, 1319), people: ['saad-ibn-muadh', 'abu-jahl-ibn-hisham', 'umayyah-ibn-khalaf'] },
        { title: "«إنهم قاتلوك»", text: sahih('bukhari', 3950, 1320, 1522), people: ['saad-ibn-muadh', 'umayyah-ibn-khalaf', 'prophet-muhammad'] },
        { title: "«والله لا أخرج من مكة»", text: sahih('bukhari', 3950, 1523, 1820), people: ['umayyah-ibn-khalaf'] },
        { title: "«أدركوا عيركم»", text: sahih('bukhari', 3950, 1821, 2232), people: ['abu-jahl-ibn-hisham', 'umayyah-ibn-khalaf'] },
        { title: "«وقد نسيت ما قال لك أخوك اليثربي؟»", text: sahih('bukhari', 3950, 2233, 2442), people: ['umayyah-ibn-khalaf'] },
        { title: "قتله الله ببدر", text: sahih('bukhari', 3950, 2443, 2587), people: ['umayyah-ibn-khalaf'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default saadIbnMuadhAndUmayyah;
