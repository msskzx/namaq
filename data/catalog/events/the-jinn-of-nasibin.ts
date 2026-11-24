import { sahih } from '@/lib/catalog/sahihText';
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
      isnad: sahih('bukhari', 3860, 0, 145),
      source: { slug: 'sahih-al-bukhari', hadith: 3860, url: 'https://sunnah.com/bukhari:3860' },
      moments: [
        { title: 'يحمل له الإداوة', text: sahih('bukhari', 3860, 146, 310), people: ['abu-hurayrah', 'prophet-muhammad'] },
        { title: '«ولا تأتني بعظم ولا بروثة»', text: sahih('bukhari', 3860, 311, 509), people: ['prophet-muhammad', 'abu-hurayrah'] },
        { title: '«ما بال العظم والروثة»', text: sahih('bukhari', 3860, 510, 584), people: ['abu-hurayrah', 'prophet-muhammad'] },
        { title: '«أتاني وفد جن نصيبين»', text: sahih('bukhari', 3860, 585, 812), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theJinnOfNasibin;
