import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * In his illness they put medicine in the side of his mouth though he signed to them not to, thinking it a sick man's dislike
 * of medicine; when he woke he said «ألم أنهكم أن تلدوني» and had everyone in the house given it while he watched, except
 * al-Abbas, who had not been there. Told from Sahih al-Bukhari 4458 (al-Maghazi, the illness of the Prophet ﷺ), whole; our
 * copy prints it as the addition («وزاد») to the hadith before it, whose numbers 4456–4457 it does not hold. Al-Abbas is
 * named only as the one who was not there and is not linked.
 */
const theMedicineInHisMouth = {
  kind: 'EVENT',
  slug: 'the-medicine-in-his-mouth',
  name: "اللدود في مرضه ﷺ",
  nameTransliterated: "The medicine put in his mouth",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'aisha-bint-abi-bakr' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4458, 0, 67),
      source: { slug: 'sahih-al-bukhari', hadith: 4458, url: 'https://sunnah.com/bukhari:4458' },
      moments: [
        { title: "لددناه في مرضه", text: sahih('bukhari', 4458, 68, 191), people: ['aisha-bint-abi-bakr', 'prophet-muhammad'] },
        { title: "«ألم أنهكم أن تلدوني»", text: sahih('bukhari', 4458, 192, 514), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theMedicineInHisMouth;
