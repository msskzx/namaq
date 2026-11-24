import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Hudhayfah and his father Husayl, setting out, were taken by Quraysh and let go on their oath not to fight with the Prophet ﷺ;
 * he told them «انصرفا. نفي بعهدهم، ونستعين الله عليهم», and so they missed Badr. Told from Sahih Muslim 1787 (al-Jihad, the
 * chapter on keeping a pledge), whole. His father, named «حسيل» and «أبي» in the text, is linked as hisl-ibn-jabir-al-absi,
 * whose catalog file has him as Hudhayfah's father.
 */
const hudhayfahAndHisFatherBeforeBadr = {
  kind: 'EVENT',
  slug: 'hudhayfah-and-his-father-before-badr',
  name: "حذيفة وأبوه قبل بدر",
  nameTransliterated: "Hudhayfah and his father before Badr",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'hudhayfah-ibn-al-yaman' }, { person: 'hisl-ibn-jabir-al-absi' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('muslim', 1787, 0, 172),
      source: { slug: 'sahih-muslim', hadith: 1787, url: 'https://sunnah.com/muslim:1787' },
      moments: [
        { title: "«ما نريد إلا المدينة»", text: sahih('muslim', 1787, 173, 494), people: ['hudhayfah-ibn-al-yaman', 'hisl-ibn-jabir-al-absi'],
          turns: [
            { text: sahih('muslim', 1787, 173, 288) },
            { text: sahih('muslim', 1787, 289, 330), speaker: { name: "كفار قريش" }, lead: sahih('muslim', 1787, 289, 297), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 302, quote: "(كفار قريش) فـ (ـقالوا) لنا: (إنكم تريدون محمدًا", url: "https://shamela.ws/book/18268/7977" } },
            { text: sahih('muslim', 1787, 331, 389) },
            { text: sahih('muslim', 1787, 390, 494) },
          ] },
        { title: "«نفي بعهدهم، ونستعين الله عليهم»", text: sahih('muslim', 1787, 495, 607), people: ['hudhayfah-ibn-al-yaman', 'hisl-ibn-jabir-al-absi', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1787, 495, 540) },
            { text: sahih('muslim', 1787, 541, 607), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1787, 541, 545), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 302, quote: "(فقال) لنا رسول الله ﷺ: (انصرفا)", url: "https://shamela.ws/book/18268/7977" } },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default hudhayfahAndHisFatherBeforeBadr;
