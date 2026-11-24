import { sahih } from '@/lib/catalog/sahihText';
import { legacyUnreviewed, type CatalogEvent } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/eventSeedData.ts entry, uncited.
 *
 * Told as a story from Sahih al-Bukhari (al-Maghazi, the illness and death of the Prophet ﷺ), each hadith whole: Aisha's
 * 4449 first, the fullest (the siwak, «لا إله إلا الله، إن للموت سكرات», «في الرفيق الأعلى» until his hand fell); then
 * her 4450, 4451, 4438, 4463 and 4437 (he was given the choice); Anas's 4462 (Fatimah, «وا كرب أباه» and «أطابت أنفسكم أن
 * تحثوا على رسول الله ﷺ التراب»); then the short ones, 4435 (he recited «مع الذين أنعم الله عليهم»), 4459 (Aisha denies
 * that he made a bequest to Ali), 4440, 4446 and 4436. 4449 says only «عبد الرحمن»; he is Abd al-Rahman ibn Abi Bakr as
 * 4450 and 4451 name him. Ali is named in 4459 only in the claim Aisha denies and is not linked from it. 4439 (the mu'awwidhat), 4441, 4443 (sayings),
 * 4445 (its start, 4444, is not in our copy) and 4460–4461, 4464–4467 (rulings and counts) are not told.
 */
const passingOfTheProphetMuhammad = {
  kind: 'EVENT',
  slug: 'passing-of-the-prophet-muhammad',
  name: 'وفاة النبي محمد ﷺ',
  nameTransliterated: 'Passing of the Prophet Muhammad (PBUH)',
  type: 'DEATH',
  fields: {
    hijriYear: { value: 11, claims: legacyUnreviewed },
    location: { value: 'المدينة المنورة', claims: legacyUnreviewed },
    description: { value: 'وفاة النبي محمد صلى الله عليه وسلم', claims: legacyUnreviewed },
  },
  people: [
    { person: 'prophet-muhammad', claims: legacyUnreviewed },
    { person: 'aisha-bint-abi-bakr', claims: legacyUnreviewed },
    { person: 'fatimah-bint-muhammad', claims: legacyUnreviewed },
    { person: 'ali-ibn-abi-talib', claims: legacyUnreviewed },
    { person: 'abd-al-rahman-ibn-abi-bakr' },
    { person: 'anas-ibn-malik' },
  ],
  tags: ['HIS_WORDS'],
  ayat: [
    {
      kind: 'RECITED',
      from: '4:69',
      to: '4:69',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4435, url: 'https://sunnah.com/bukhari:4435', quote: sahih('bukhari', 4435, 313, 373) }],
    },
  ],
  reports: [
    {
      isnad: sahih('bukhari', 4449, 0, 230),
      source: { slug: 'sahih-al-bukhari', hadith: 4449, url: 'https://sunnah.com/bukhari:4449' },
      moments: [
        { title: "«إن من نعم الله علي»", text: sahih('bukhari', 4449, 231, 414), people: ['aisha-bint-abi-bakr', 'prophet-muhammad'] },
        { title: "فأشار برأسه أن نعم", text: sahih('bukhari', 4449, 415, 754), people: ['aisha-bint-abi-bakr', 'abd-al-rahman-ibn-abi-bakr', 'prophet-muhammad'] },
        { title: "«إن للموت سكرات»", text: sahih('bukhari', 4449, 755, 959), people: ['prophet-muhammad'] },
        { title: "«في الرفيق الأعلى»", text: sahih('bukhari', 4449, 960, 1058), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4450, 0, 151),
      source: { slug: 'sahih-al-bukhari', hadith: 4450, url: 'https://sunnah.com/bukhari:4450' },
      moments: [
        { title: "«أين أنا غدا»", text: sahih('bukhari', 4450, 152, 577), people: ['prophet-muhammad', 'aisha-bint-abi-bakr'] },
        { title: "«أعطني هذا السواك يا عبد الرحمن»", text: sahih('bukhari', 4450, 578, 901), people: ['abd-al-rahman-ibn-abi-bakr', 'aisha-bint-abi-bakr', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4451, 0, 151),
      source: { slug: 'sahih-al-bukhari', hadith: 4451, url: 'https://sunnah.com/bukhari:4451' },
      moments: [
        { title: "«في الرفيق الأعلى، في الرفيق الأعلى»", text: sahih('bukhari', 4451, 152, 409), people: ['aisha-bint-abi-bakr', 'prophet-muhammad'] },
        { title: "جريدة رطبة", text: sahih('bukhari', 4451, 410, 861), people: ['abd-al-rahman-ibn-abi-bakr', 'aisha-bint-abi-bakr', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4438, 0, 144),
      source: { slug: 'sahih-al-bukhari', hadith: 4438, url: 'https://sunnah.com/bukhari:4438' },
      moments: [
        { title: "سواك رطب", text: sahih('bukhari', 4438, 145, 531), people: ['abd-al-rahman-ibn-abi-bakr', 'aisha-bint-abi-bakr', 'prophet-muhammad'] },
        { title: "«في الرفيق الأعلى»", text: sahih('bukhari', 4438, 532, 722), people: ['prophet-muhammad', 'aisha-bint-abi-bakr'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4463, 0, 191),
      source: { slug: 'sahih-al-bukhari', hadith: 4463, url: 'https://sunnah.com/bukhari:4463' },
      moments: [
        { title: "«إنه لم يقبض نبي حتى يرى مقعده من الجنة»", text: sahih('bukhari', 4463, 192, 323), people: ['prophet-muhammad'] },
        { title: "«اللهم الرفيق الأعلى»", text: sahih('bukhari', 4463, 324, 686), people: ['prophet-muhammad', 'aisha-bint-abi-bakr'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4437, 0, 127),
      source: { slug: 'sahih-al-bukhari', hadith: 4437, url: 'https://sunnah.com/bukhari:4437' },
      moments: [
        { title: "«إنه لم يقبض نبي قط حتى يرى مقعده من الجنة»", text: sahih('bukhari', 4437, 128, 283), people: ['prophet-muhammad'] },
        { title: "«اللهم في الرفيق الأعلى»", text: sahih('bukhari', 4437, 284, 589), people: ['prophet-muhammad', 'aisha-bint-abi-bakr'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4462, 0, 89),
      source: { slug: 'sahih-al-bukhari', hadith: 4462, url: 'https://sunnah.com/bukhari:4462' },
      moments: [
        { title: "«وا كرب أباه»", text: sahih('bukhari', 4462, 90, 253), people: ['fatimah-bint-muhammad', 'prophet-muhammad'] },
        { title: "«يا أبتاه، أجاب ربا دعاه»", text: sahih('bukhari', 4462, 254, 410), people: ['fatimah-bint-muhammad', 'prophet-muhammad'] },
        { title: "«يا أنس، أطابت أنفسكم»", text: sahih('bukhari', 4462, 411, 542), people: ['fatimah-bint-muhammad', 'anas-ibn-malik', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4435, 0, 129),
      source: { slug: 'sahih-al-bukhari', hadith: 4435, url: 'https://sunnah.com/bukhari:4435' },
      moments: [
        { title: "«فظننت أنه خير»", text: sahih('bukhari', 4435, 130, 403), people: ['aisha-bint-abi-bakr', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4459, 0, 130),
      source: { slug: 'sahih-al-bukhari', hadith: 4459, url: 'https://sunnah.com/bukhari:4459' },
      moments: [
        { title: "«فكيف أوصى إلى علي»", text: sahih('bukhari', 4459, 131, 383), people: ['aisha-bint-abi-bakr', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4440, 0, 191),
      source: { slug: 'sahih-al-bukhari', hadith: 4440, url: 'https://sunnah.com/bukhari:4440' },
      moments: [
        { title: "«وألحقني بالرفيق»", text: sahih('bukhari', 4440, 192, 374), people: ['aisha-bint-abi-bakr', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4446, 0, 171),
      source: { slug: 'sahih-al-bukhari', hadith: 4446, url: 'https://sunnah.com/bukhari:4446' },
      moments: [
        { title: "«فلا أكره شدة الموت لأحد أبدا»", text: sahih('bukhari', 4446, 172, 308), people: ['aisha-bint-abi-bakr', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4436, 0, 93),
      source: { slug: 'sahih-al-bukhari', hadith: 4436, url: 'https://sunnah.com/bukhari:4436' },
      moments: [
        { title: "«في الرفيق الأعلى»", text: sahih('bukhari', 4436, 94, 196), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default passingOfTheProphetMuhammad;
