import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Ja'far ibn Amr and Ubayd Allah ibn Adi found Wahshi at Hims and asked him how he killed Hamzah: his master Jubayr ibn Mut'im
 * promised him his freedom for his uncle killed at Badr; at Uhud he lay in wait behind a rock and threw his spear; later he
 * came to the Prophet ﷺ, who asked him to keep his face away, and after his death Wahshi went out against Musaylimah and threw
 * the same spear. Told from Sahih al-Bukhari 4072 (al-Maghazi, the chapter on the killing of Hamzah), whole. Wahshi, Ubayd
 * Allah ibn Adi, Siba' and Musaylimah have no catalog subject and are not linked.
 */
const theKillingOfHamzah = {
  kind: 'EVENT',
  slug: 'the-killing-of-hamzah',
  name: "مقتل حمزة",
  nameTransliterated: "The killing of Hamzah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'hamzah-ibn-abd-al-muttalib' }, { person: 'jubair-ibn-mutim' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4072, 0, 287),
      source: { slug: 'sahih-al-bukhari', hadith: 4072, url: 'https://sunnah.com/bukhari:4072' },
      moments: [
        { title: "«هل لك في وحشي»", text: sahih('bukhari', 4072, 288, 783), people: [] },
        { title: "«فلكأني نظرت إلى قدميك»", text: sahih('bukhari', 4072, 784, 1182), people: [] },
        { title: "«إن قتلت حمزة بعمي فأنت حر»", text: sahih('bukhari', 4072, 1183, 1459), people: ['hamzah-ibn-abd-al-muttalib', 'jubair-ibn-mutim'] },
        { title: "«يا سباع»", text: sahih('bukhari', 4072, 1460, 1920), people: ['hamzah-ibn-abd-al-muttalib'] },
        { title: "رميته بحربتي", text: sahih('bukhari', 4072, 1921, 2115), people: ['hamzah-ibn-abd-al-muttalib'] },
        { title: "«فهل تستطيع أن تغيب وجهك عني؟»", text: sahih('bukhari', 4072, 2116, 2616), people: ['prophet-muhammad', 'hamzah-ibn-abd-al-muttalib'] },
        { title: "«لعلي أقتله فأكافئ به حمزة»", text: sahih('bukhari', 4072, 2617, 3128), people: ['prophet-muhammad', 'hamzah-ibn-abd-al-muttalib'] },
        { title: "«قتله العبد الأسود»", text: sahih('bukhari', 4072, 3129, 3359), people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theKillingOfHamzah;
