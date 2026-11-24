import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Sa'd took a sword from the fifth and brought it to the Prophet ﷺ asking «هب لي هذا»; he refused, and «يسألونك عن
 * الأنفال قل الأنفال لله والرسول» was sent down. Told from Sahih Muslim 1748 (al-Jihad, the spoils), the first of its
 * routes, whole. The chain names the teller as Mus'ab ibn Sa'd «عن أبيه», Sa'd ibn Abi Waqqas, who is linked.
 */
const theSwordFromTheKhumus = {
  kind: 'EVENT',
  slug: 'the-sword-from-the-khumus',
  name: "سيف سعد ونزول الأنفال",
  nameTransliterated: "Sa'd's sword and al-Anfal",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'saad-ibn-abi-waqqas' }, { person: 'prophet-muhammad' }],
  tags: ['REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      about: 'saad-ibn-abi-waqqas',
      from: '8:1',
      to: '8:1',
      evidence: [{ source: 'sahih-muslim', hadith: 1748, url: 'https://sunnah.com/muslim:1748', quote: sahih('muslim', 1748, 224, 306) }],
    },
  ],
  reports: [
    {
      isnad: sahih('muslim', 1748, 0, 125),
      source: { slug: 'sahih-muslim', hadith: 1748, url: 'https://sunnah.com/muslim:1748' },
      moments: [
        { title: "«هب لي هذا»", text: sahih('muslim', 1748, 126, 322), people: ['saad-ibn-abi-waqqas', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1748, 126, 189) },
            { text: sahih('muslim', 1748, 190, 214), speaker: { person: "saad-ibn-abi-waqqas", name: "سعد" }, lead: sahih('muslim', 1748, 190, 198), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 131, quote: "(أخذ أبي) سعد … (النبي ﷺ فقال) أبي للنبي ﷺ (هب لي)", url: "https://shamela.ws/book/18268/7806" } },
            { text: sahih('muslim', 1748, 215, 322) },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theSwordFromTheKhumus;
