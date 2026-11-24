import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Al-Miswar ibn Makhramah and Abd al-Rahman ibn al-Aswad sent Ubayd Allah ibn Adi to speak to his uncle Uthman about
 * al-Walid ibn Uqbah; Uthman, told of his two hijras and his companionship, answered with his own and his obedience to
 * the Prophet ﷺ, Abu Bakr and Umar, and had al-Walid flogged forty lashes, Ali flogging him. Told from Sahih al-Bukhari
 * 3872 (the chapter on the hijra to Abyssinia), whole. Ubayd Allah, al-Miswar, Ibn Abd Yaghuth and al-Walid have no
 * catalog subject and are not linked. Uthman's answer alone, as al-Bukhari gives it again in the chapter on the arrival
 * in Medina (3927), follows, whole.
 */
const ubaydullahCounselsUthman = {
  kind: 'EVENT',
  slug: 'ubaydullah-counsels-uthman',
  name: "عبيد الله بن عدي ينصح عثمان",
  nameTransliterated: "Ubayd Allah ibn Adi counsels Uthman",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'uthman-ibn-affan' }, { person: 'ali-ibn-abi-talib' }],
  reports: [
    {
      isnad: sahih('bukhari', 3872, 0, 213),
      source: { slug: 'sahih-al-bukhari', hadith: 3872, url: 'https://sunnah.com/bukhari:3872' },
      moments: [
        { title: "«ما يمنعك أن تكلم خالك عثمان»", text: sahih('bukhari', 3872, 214, 451), people: ['uthman-ibn-affan'] },
        { title: "«أعوذ بالله منك»", text: sahih('bukhari', 3872, 452, 659), people: ['uthman-ibn-affan'] },
        { title: "«قد ابتلاك الله»", text: sahih('bukhari', 3872, 660, 959), people: ['uthman-ibn-affan'] },
        { title: "نصيحته لعثمان", text: sahih('bukhari', 3872, 960, 1416), people: ['uthman-ibn-affan', 'prophet-muhammad'] },
        { title: "«ما خلص إلى العذراء في سترها»", text: sahih('bukhari', 3872, 1417, 1581), people: ['uthman-ibn-affan', 'prophet-muhammad'] },
        { title: "«والله ما عصيته ولا غششته»", text: sahih('bukhari', 3872, 1582, 2376), people: ['uthman-ibn-affan', 'prophet-muhammad', 'abu-bakr-as-siddiq', 'umar-ibn-al-khattab'] },
        { title: "جلد الوليد أربعين", text: sahih('bukhari', 3872, 2377, 2486), people: ['uthman-ibn-affan', 'ali-ibn-abi-talib'] },
        { title: "رواية يونس وابن أخي الزهري", text: sahih('bukhari', 3872, 2487, 2619), people: [] },
      ],
    },
    {
      isnad: sahih('bukhari', 3927, 0, 363),
      source: { slug: 'sahih-al-bukhari', hadith: 3927, url: 'https://sunnah.com/bukhari:3927' },
      moments: [
        { title: "«فوالله ما عصيته ولا غششته»", text: sahih('bukhari', 3927, 364, 779), people: ['uthman-ibn-affan', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default ubaydullahCounselsUthman;
