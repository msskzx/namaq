import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Asked for the worst thing the idolaters did to the Prophet ﷺ, Abd Allah ibn Amr ibn al-As told of Uqbah ibn Abi Mu'ayt
 * twisting his garment round his neck as he prayed in the Hijr of the Ka'bah, until Abu Bakr pushed him off with
 * {أتقتلون رجلا أن يقول ربي الله} (Ghafir 28). Told from Sahih al-Bukhari 3856 (Manaqib al-Ansar), whole, with al-Bukhari's
 * notes on who was asked: Abd Allah ibn Amr in Ibn Ishaq's chain, Amr ibn al-As in Abdah's and Muhammad ibn Amr's.
 */
const abuBakrDefendsTheProphet = {
  kind: 'EVENT',
  slug: 'abu-bakr-defends-the-prophet',
  name: "أبو بكر يدفع عقبة عن النبي ﷺ",
  nameTransliterated: "Abu Bakr pushes Uqbah away from the Prophet",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abu-bakr-as-siddiq' }, { person: 'prophet-muhammad' }, { person: 'uqba-ibn-abi-muayt' }, { person: 'abdullah-ibn-amr-ibn-al-as' }],
  ayat: [
    {
      kind: 'RECITED',
      from: '40:28',
      to: '40:28',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 3856, url: 'https://sunnah.com/bukhari:3856', quote: sahih('bukhari', 3856, 512, 659) }],
    },
  ],
  reports: [
    {
      isnad: sahih('bukhari', 3856, 0, 230),
      source: { slug: 'sahih-al-bukhari', hadith: 3856, url: 'https://sunnah.com/bukhari:3856' },
      moments: [
        { title: "«أشد شيء صنعه المشركون»", text: sahih('bukhari', 3856, 231, 345), people: ['abdullah-ibn-amr-ibn-al-as', 'prophet-muhammad'] },
        { title: "عقبة يخنقه بثوبه", text: sahih('bukhari', 3856, 346, 511), people: ['prophet-muhammad', 'uqba-ibn-abi-muayt'] },
        { title: "«أتقتلون رجلا أن يقول ربي الله»", text: sahih('bukhari', 3856, 512, 660), people: ['abu-bakr-as-siddiq', 'prophet-muhammad', 'uqba-ibn-abi-muayt'] },
        { title: "من سُئل عن ذلك", text: sahih('bukhari', 3856, 661, 936), people: ['abdullah-ibn-amr-ibn-al-as', 'amr-ibn-al-as'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abuBakrDefendsTheProphet;
