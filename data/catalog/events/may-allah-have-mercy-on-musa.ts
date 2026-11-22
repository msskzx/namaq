import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * When the Prophet ﷺ divided the spoils of Hunayn, giving al-Aqra' and Uyaynah a hundred camels each, a man said the
 * division was not meant for Allah; Ibn Mas'ud told him, his face changed, and he said «رحم الله موسى، قد أوذي بأكثر من
 * هذا فصبر». Told from Ibn Mas'ud's hadith in Sahih al-Bukhari (al-Maghazi, the raid of al-Ta'if), each whole: 4336 first,
 * the fuller, then 4335. The man, al-Aqra' and Uyaynah have no catalog subject and are not linked.
 */
const mayAllahHaveMercyOnMusa = {
  kind: 'EVENT',
  slug: 'may-allah-have-mercy-on-musa',
  name: "رحم الله موسى",
  nameTransliterated: "May Allah have mercy on Musa",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abdullah-ibn-masud' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا قُتَيْبَةُ بْنُ سَعِيدٍ: حَدَّثَنَا جَرِيرٌ، عَنْ مَنْصُورٍ، عَنْ أَبِي وَائِلٍ، عَنْ عَبْدِ اللهِ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4336, url: 'https://sunnah.com/bukhari:4336' },
      moments: [
        { title: "«ما أريد بهذه القسمة وجه الله»", text: "«لَمَّا كَانَ يَوْمُ حُنَيْنٍ آثَرَ النَّبِيُّ ﷺ نَاسًا، أَعْطَى الْأَقْرَعَ مِائَةً مِنَ الْإِبِلِ، وَأَعْطَى عُيَيْنَةَ مِثْلَ ذَلِكَ، وَأَعْطَى نَاسًا، فَقَالَ رَجُلٌ: مَا أُرِيدَ بِهَذِهِ الْقِسْمَةِ وَجْهُ اللهِ،", people: ['prophet-muhammad'] },
        { title: "«رحم الله موسى»", text: "فَقُلْتُ: لَأُخْبِرَنَّ النَّبِيَّ ﷺ، قَالَ: رَحِمَ اللهُ مُوسَى، قَدْ أُوذِيَ بِأَكْثَرَ مِنْ هَذَا فَصَبَرَ.»", people: ['abdullah-ibn-masud', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا قَبِيصَةُ: حَدَّثَنَا سُفْيَانُ، عَنِ الْأَعْمَشِ، عَنْ أَبِي وَائِلٍ، عَنْ عَبْدِ اللهِ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4335, url: 'https://sunnah.com/bukhari:4335' },
      moments: [
        { title: "«ما أراد بها وجه الله»", text: "«لَمَّا قَسَمَ النَّبِيُّ ﷺ قِسْمَةَ حُنَيْنٍ، قَالَ رَجُلٌ مِنَ الْأَنْصَارِ: مَا أَرَادَ بِهَا وَجْهَ اللهِ،", people: ['prophet-muhammad'] },
        { title: "«رحمة الله على موسى»", text: "فَأَتَيْتُ النَّبِيَّ ﷺ فَأَخْبَرْتُهُ، فَتَغَيَّرَ وَجْهُهُ ثُمَّ قَالَ: رَحْمَةُ اللهِ عَلَى مُوسَى، لَقَدْ أُوذِيَ بِأَكْثَرَ مِنْ هَذَا فَصَبَرَ.»", people: ['abdullah-ibn-masud', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default mayAllahHaveMercyOnMusa;
