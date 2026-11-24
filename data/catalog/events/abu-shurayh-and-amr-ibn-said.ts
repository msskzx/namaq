import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * As Amr ibn Sa'id sent troops against Makkah, Abu Shurayh told him what the Prophet ﷺ said the day after the conquest:
 * «إن مكة حرمها الله ولم يحرمها الناس… وإنما أذن لي فيها ساعة من نهار»; Amr answered «أنا أعلم بذلك منك يا أبا شريح».
 * Told from Sahih al-Bukhari 4295 (al-Maghazi, the chapter on the conquest), whole. Abu Shurayh has no catalog subject;
 * this Amr ibn Sa'id is the governor of Medina under Yazid, not the Companion amr-ibn-said-al-umawi, and is not linked.
 */
const abuShurayhAndAmrIbnSaid = {
  kind: 'EVENT',
  slug: 'abu-shurayh-and-amr-ibn-said',
  name: "أبو شريح وعمرو بن سعيد",
  nameTransliterated: "Abu Shurayh and Amr ibn Sa'id",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4295, 0, 113),
      source: { slug: 'sahih-al-bukhari', hadith: 4295, url: 'https://sunnah.com/bukhari:4295' },
      moments: [
        { title: "«ائذن لي أيها الأمير»", text: sahih('bukhari', 4295, 114, 387), people: [] },
        { title: "«إن مكة حرمها الله»", text: sahih('bukhari', 4295, 388, 893), people: ['prophet-muhammad'] },
        { title: "«إن الحرم لا يعيذ عاصيا»", text: sahih('bukhari', 4295, 894, 1098), people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abuShurayhAndAmrIbnSaid;
