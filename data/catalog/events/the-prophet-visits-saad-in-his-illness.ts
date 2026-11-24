import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ visited Sa'd ibn Abi Waqqas in the year of the Farewell Hajj, in an illness that brought him near death;
 * Sa'd asked to give two thirds of his wealth in charity, then half, and was told «الثلث يا سعد، والثلث كثير», and feared being
 * left behind after his companions; the Prophet ﷺ prayed that their hijra be completed for them and grieved for Sa'd ibn
 * Khawlah, who died at Makkah. Told from Sahih al-Bukhari 3936 (Manaqib al-Ansar, the chapter on «اللهم أمض لأصحابي
 * هجرتهم»), whole, with al-Bukhari's notes on Ahmad ibn Yunus's wording. Sa'd ibn Khawlah has no catalog subject and is
 * not linked.
 *
 * Then Sahih al-Bukhari 4409 (al-Maghazi, the farewell hajj), the same hadith by Ibrahim ibn Sa'd's other route, whole.
 */
const theProphetVisitsSaadInHisIllness = {
  kind: 'EVENT',
  slug: 'the-prophet-visits-saad-in-his-illness',
  name: "عيادة النبي ﷺ سعد بن أبي وقاص",
  nameTransliterated: "The Prophet visits Sa'd ibn Abi Waqqas in his illness",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'saad-ibn-abi-waqqas' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 3936, 0, 137),
      source: { slug: 'sahih-al-bukhari', hadith: 3936, url: 'https://sunnah.com/bukhari:3936' },
      moments: [
        { title: "عاده عام حجة الوداع", text: sahih('bukhari', 3936, 138, 232), people: ['saad-ibn-abi-waqqas', 'prophet-muhammad'] },
        { title: "«الثلث يا سعد، والثلث كثير»", text: sahih('bukhari', 3936, 233, 598), people: ['saad-ibn-abi-waqqas', 'prophet-muhammad'] },
        { title: "«حتى اللقمة تجعلها في في امرأتك»", text: sahih('bukhari', 3936, 599, 804), people: ['prophet-muhammad'] },
        { title: "«اللهم أمض لأصحابي هجرتهم»", text: sahih('bukhari', 3936, 805, 1146), people: ['saad-ibn-abi-waqqas', 'prophet-muhammad'] },
        { title: "«لكن البائس سعد بن خولة»", text: sahih('bukhari', 3936, 1147, 1324), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4409, 0, 149),
      source: { slug: 'sahih-al-bukhari', hadith: 4409, url: 'https://sunnah.com/bukhari:4409' },
      moments: [
        { title: "«أفأتصدق بثلثي مالي؟»", text: sahih('bukhari', 4409, 150, 752), people: ['saad-ibn-abi-waqqas', 'prophet-muhammad'] },
        { title: "«اللهم أمض لأصحابي هجرتهم»", text: sahih('bukhari', 4409, 753, 1186), people: ['saad-ibn-abi-waqqas', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theProphetVisitsSaadInHisIllness;
