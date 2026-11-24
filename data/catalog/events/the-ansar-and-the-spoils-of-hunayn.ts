import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ gave the spoils of Hunayn to Quraysh and the newly reconciled and nothing to the Ansar, some of whom said
 * «يعطي قريشا ويتركنا، وسيوفنا تقطر من دمائهم»; he gathered them in a leather tent and said «أما ترضون أن يذهب الناس
 * بالشاة والبعير، وتذهبون بالنبي ﷺ إلى رحالكم», «الأنصار شعار والناس دثار», and told them to be patient until they met
 * him at the Pool. Told from Sahih al-Bukhari (al-Maghazi, the raid of al-Ta'if), each hadith whole: Anas's 4337 first,
 * the fullest, which begins with the stand at Hunayn; then Anas's 4331, Abd Allah ibn Zayd's 4330, and Anas's 4333, 4334
 * and 4332. 4332 says it was «يوم فتح مكة»; it is kept as printed. Anas is linked where he answers that he was there.
 */
const theAnsarAndTheSpoilsOfHunayn = {
  kind: 'EVENT',
  slug: 'the-ansar-and-the-spoils-of-hunayn',
  name: "الأنصار وغنائم حنين",
  nameTransliterated: "The Ansar and the spoils of Hunayn",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'anas-ibn-malik' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4337, 0, 190),
      source: { slug: 'sahih-al-bukhari', hadith: 4337, url: 'https://sunnah.com/bukhari:4337' },
      moments: [
        { title: "«أنا عبد الله ورسوله»", text: sahih('bukhari', 4337, 191, 791), people: ['prophet-muhammad'] },
        { title: "لم يعط الأنصار شيئا", text: sahih('bukhari', 4337, 792, 1041), people: ['prophet-muhammad'] },
        { title: "«ألا ترضون أن يذهب الناس بالدنيا»", text: sahih('bukhari', 4337, 1042, 1450), people: ['prophet-muhammad'] },
        { title: "«وأين أغيب عنه»", text: sahih('bukhari', 4337, 1451, 1543), people: ['anas-ibn-malik'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4331, 0, 159),
      source: { slug: 'sahih-al-bukhari', hadith: 4331, url: 'https://sunnah.com/bukhari:4331' },
      moments: [
        { title: "«يعطي قريشا ويتركنا»", text: sahih('bukhari', 4331, 160, 450), people: ['prophet-muhammad'] },
        { title: "«ما حديث بلغني عنكم»", text: sahih('bukhari', 4331, 451, 951), people: ['prophet-muhammad'] },
        { title: "«فإني أعطي رجالا حديثي عهد بكفر أتألفهم»", text: sahih('bukhari', 4331, 952, 1214), people: ['prophet-muhammad'] },
        { title: "«فاصبروا حتى تلقوا الله ورسوله ﷺ»", text: sahih('bukhari', 4331, 1215, 1427), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4330, 0, 168),
      source: { slug: 'sahih-al-bukhari', hadith: 4330, url: 'https://sunnah.com/bukhari:4330' },
      moments: [
        { title: "لم يعط الأنصار شيئا", text: sahih('bukhari', 4330, 169, 379), people: ['prophet-muhammad'] },
        { title: "«ألم أجدكم ضلالا فهداكم الله بي»", text: sahih('bukhari', 4330, 380, 747), people: ['prophet-muhammad'] },
        { title: "«الأنصار شعار والناس دثار»", text: sahih('bukhari', 4330, 748, 1188), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4333, 0, 155),
      source: { slug: 'sahih-al-bukhari', hadith: 4333, url: 'https://sunnah.com/bukhari:4333' },
      moments: [
        { title: "«يا معشر الأنصار»", text: sahih('bukhari', 4333, 156, 454), people: ['prophet-muhammad'] },
        { title: "«لاخترت شعب الأنصار»", text: sahih('bukhari', 4333, 455, 838), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4334, 0, 149),
      source: { slug: 'sahih-al-bukhari', hadith: 4334, url: 'https://sunnah.com/bukhari:4334' },
      moments: [
        { title: "«إني أردت أن أجبرهم وأتألفهم»", text: sahih('bukhari', 4334, 150, 569), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4332, 0, 99),
      source: { slug: 'sahih-al-bukhari', hadith: 4332, url: 'https://sunnah.com/bukhari:4332' },
      moments: [
        { title: "«أما ترضون أن يذهب الناس بالدنيا»", text: sahih('bukhari', 4332, 100, 462), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theAnsarAndTheSpoilsOfHunayn;
