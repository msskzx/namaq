import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Sa'd ibn Mu'adh was shot in the arm vein at the trench, and the Prophet ﷺ pitched a tent for him in the mosque; when he had
 * laid down his arms Jibril came and pointed him to Banu Qurayzah, who came down to his judgement, and he left it to Sa'd;
 * Sa'd judged, asked Allah to keep him for any war left with Quraysh or else let the wound open, and it opened and he died.
 * Told from Sahih al-Bukhari, each hadith whole: Aisha's 4122 first (al-Maghazi, the chapter on the return from the
 * Confederates and the march on Banu Qurayzah), the fullest; then her 4117; Abu Sa'id's 4121, «قوموا إلى سيدكم»; and Anas's
 * 4118, the dust of Jibril's procession. Hibban ibn al-Ariqah has no catalog subject and is not linked.
 *
 * Then Sahih Muslim (al-Jihad, fighting those who break a pact), each whole: Aisha's 1769, then Abu Sa'id's 1768.
 */
const theJudgementOfSaadIbnMuadh = {
  kind: 'EVENT',
  slug: 'the-judgement-of-saad-ibn-muadh',
  name: "حكم سعد بن معاذ في بني قريظة",
  nameTransliterated: "Sa'd ibn Mu'adh's judgement on Banu Qurayzah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'saad-ibn-muadh' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4122, 0, 149),
      source: { slug: 'sahih-al-bukhari', hadith: 4122, url: 'https://sunnah.com/bukhari:4122' },
      moments: [
        { title: "رمي سعد في الأكحل", text: sahih('bukhari', 4122, 150, 353), people: ['saad-ibn-muadh', 'prophet-muhammad'] },
        { title: "«قد وضعت السلاح»", text: sahih('bukhari', 4122, 354, 650), people: ['prophet-muhammad'] },
        { title: "«فإني أحكم فيهم»", text: sahih('bukhari', 4122, 651, 875), people: ['prophet-muhammad', 'saad-ibn-muadh'] },
        { title: "«فأبقني له»", text: sahih('bukhari', 4122, 876, 1340), people: ['saad-ibn-muadh', 'prophet-muhammad'] },
        { title: "فانفجرت من لبته", text: sahih('bukhari', 4122, 1341, 1622), people: ['saad-ibn-muadh'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4117, 0, 138),
      source: { slug: 'sahih-al-bukhari', hadith: 4117, url: 'https://sunnah.com/bukhari:4117' },
      moments: [
        { title: "«قد وضعت السلاح؟»", text: sahih('bukhari', 4117, 139, 329), people: ['prophet-muhammad'] },
        { title: "«فإلى أين؟»", text: sahih('bukhari', 4117, 330, 439), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4121, 0, 187),
      source: { slug: 'sahih-al-bukhari', hadith: 4121, url: 'https://sunnah.com/bukhari:4121' },
      moments: [
        { title: "«قوموا إلى سيدكم»", text: sahih('bukhari', 4121, 188, 404), people: ['prophet-muhammad', 'saad-ibn-muadh'] },
        { title: "«قضيت بحكم الله»", text: sahih('bukhari', 4121, 405, 580), people: ['prophet-muhammad', 'saad-ibn-muadh'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4118, 0, 118),
      source: { slug: 'sahih-al-bukhari', hadith: 4118, url: 'https://sunnah.com/bukhari:4118' },
      moments: [
        { title: "موكب جبريل", text: sahih('bukhari', 4118, 119, 261), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('muslim', 1769, 0, 217),
      source: { slug: 'sahih-muslim', hadith: 1769, url: 'https://sunnah.com/muslim:1769' },
      moments: [
        { title: "أصيب سعد يوم الخندق", text: sahih('muslim', 1769, 218, 423), people: ['saad-ibn-muadh', 'prophet-muhammad'] },
        { title: "«فأين؟»", text: sahih('muslim', 1769, 424, 793), people: ['prophet-muhammad'] },
        { title: "فرد الحكم فيهم إلى سعد", text: sahih('muslim', 1769, 794, 983), people: ['prophet-muhammad', 'saad-ibn-muadh'] },
      ],
    },
    {
      isnad: sahih('muslim', 1768, 0, 391),
      source: { slug: 'sahih-muslim', hadith: 1768, url: 'https://sunnah.com/muslim:1768' },
      moments: [
        { title: "«قوموا إلى سيدكم»", text: sahih('muslim', 1768, 392, 699), people: ['prophet-muhammad', 'saad-ibn-muadh'] },
        { title: "«قضيت بحكم الله»", text: sahih('muslim', 1768, 700, 940), people: ['saad-ibn-muadh', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theJudgementOfSaadIbnMuadh;
