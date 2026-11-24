import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Before Badr the Prophet ﷺ rode to visit Sa'd ibn Ubadah with Usamah behind him and passed a gathering where Abd Allah ibn
 * Ubayy covered his nose from the dust and told him not to trouble them in their gatherings; Abd Allah ibn Rawahah answered
 * him, the people nearly came to blows, and Sa'd asked the Prophet ﷺ to pardon him, for his people had been about to crown
 * him. Told from Sahih Muslim 1798 (al-Jihad, the chapter on the Prophet's du'a and patience), whole. Anas's report of the
 * donkey and Ibn Ubayy (Muslim 1799) is told as its own story: it has the Prophet ﷺ riding to Ibn Ubayy himself.
 */
const abdullahIbnUbayyAndTheDust = {
  kind: 'EVENT',
  slug: 'abdullah-ibn-ubayy-and-the-dust',
  name: "عبد الله بن أبي وعجاجة الدابة",
  nameTransliterated: "Abd Allah ibn Ubayy and the dust",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'usamah-ibn-zaid' }, { person: 'saad-ibn-ubadah' }, { person: 'abdullah-ibn-ubayy' }, { person: 'abdullah-ibn-rawahah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('muslim', 1798, 0, 284),
      source: { slug: 'sahih-muslim', hadith: 1798, url: 'https://sunnah.com/muslim:1798' },
      moments: [
        { title: "يعود سعد بن عبادة", text: sahih('muslim', 1798, 285, 510), people: ['prophet-muhammad', 'usamah-ibn-zaid', 'saad-ibn-ubadah'],
          turns: [
            { text: sahih('muslim', 1798, 285, 510) },
          ] },
        { title: "«لا تغبروا علينا»", text: sahih('muslim', 1798, 511, 977), people: ['abdullah-ibn-ubayy', 'abdullah-ibn-rawahah', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1798, 511, 821) },
            { text: sahih('muslim', 1798, 822, 861), speaker: { person: "abdullah-ibn-ubayy", name: "عبد الله بن أبي" }, lead: sahih('muslim', 1798, 822, 834), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 334, quote: "(عبد الله بن أبي أنفه بردائه) لئلا يدخله الغبار (ثم قال) ابن أبي (لا تغبروا علينا)", url: "https://shamela.ws/book/18268/8009" } },
            { text: sahih('muslim', 1798, 862, 977) },
          ] },
        { title: "«لا أحسن من هذا»", text: sahih('muslim', 1798, 978, 1192), people: ['abdullah-ibn-ubayy', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1798, 978, 1192), speaker: { person: "abdullah-ibn-ubayy", name: "عبد الله بن أبي" }, lead: sahih('muslim', 1798, 978, 1014) },
          ] },
        { title: "«اغشنا في مجالسنا»", text: sahih('muslim', 1798, 1193, 1424), people: ['abdullah-ibn-rawahah', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1798, 1193, 1283), speaker: { person: "abdullah-ibn-rawahah", name: "عبد الله بن رواحة" }, lead: sahih('muslim', 1798, 1193, 1231) },
            { text: sahih('muslim', 1798, 1284, 1424) },
          ] },
        { title: "«اعف عنه يا رسول الله واصفح»", text: sahih('muslim', 1798, 1425, 1938), people: ['prophet-muhammad', 'saad-ibn-ubadah', 'abdullah-ibn-ubayy'],
          turns: [
            { text: sahih('muslim', 1798, 1425, 1619), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1798, 1425, 1499), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 335, quote: "(حتى دخل على سعد بن عبادة فقال) رسول الله ﷺ لسعد: (أي سعد)", url: "https://shamela.ws/book/18268/8010" } },
            { text: sahih('muslim', 1798, 1620, 1914), speaker: { person: "saad-ibn-ubadah", name: "سعد" }, lead: sahih('muslim', 1798, 1620, 1626), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 335, quote: "(قال) سعد لرسول الله ﷺ (اعف عنه)", url: "https://shamela.ws/book/18268/8010" } },
            { text: sahih('muslim', 1798, 1915, 1938) },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abdullahIbnUbayyAndTheDust;
