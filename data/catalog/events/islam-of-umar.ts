import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The day Umar ibn al-Khattab became Muslim, from the two reports of it al-Dhahabi places in al-Bukhari (al-Sira 1 pp138,
 * 140): Ibn Umar saw the people gather on him crying «صبأ عمر» until al-As ibn Wa'il took him under his protection, and
 * Ibn Mas'ud said «ما زلنا أعزة منذ أسلم عمر». The longer accounts on pp138-142 (al-Haqqah in the mosque, his sister and
 * Ta-Ha, the house at al-Safa) come with chains al-Dhahabi does not place in either Sahih, so they wait (owner: sahih first).
 */
const islamOfUmar = {
  kind: 'EVENT',
  slug: 'islam-of-umar',
  name: 'إسلام عمر بن الخطاب',
  nameTransliterated: 'Umar ibn al-Khattab\'s islam',
  type: 'OTHER',
  fields: {},
  people: [{ person: 'umar-ibn-al-khattab' }, { person: 'al-as-ibn-wail-al-sahmi' }, { person: 'abdullah-ibn-masud' }],
  tags: ['ISLAM'],
  reports: [
    {
      isnad: 'وقال ابن عيينة، عن عمرو، عن ابن عمر،',
      source: { slug: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 140, url: 'https://shamela.ws/book/10906/278' },
      grading: 'أخرجه البخاري عن ابن المديني، عنه.',
      moments: [
        { title: '«صبأ عمر»', text: 'قال: إني لعلى سطح، فرأيت الناس مجتمعين على رجل وهم يقولون: صبأ عمر، صبأ عمر.', people: ['umar-ibn-al-khattab'] },
        { title: 'العاص بن وائل يجيره', text: 'فجاء العاص بن وائل عليه قباء ديباج، فقال: إن كان عمر قد صبأ فمه أنا له جار.', people: ['al-as-ibn-wail-al-sahmi', 'umar-ibn-al-khattab'] },
        { title: 'تفرّق الناس عنه', text: 'قال فتفرق الناس عنه.', people: ['umar-ibn-al-khattab'] },
        { title: '«فعجبت من عزه»', text: 'قال: فعجبت من عزه.', people: ['umar-ibn-al-khattab'] },
      ],
    },
    {
      isnad: 'قال إسماعيل بن أبي خالد: حدثنا قيس،',
      source: { slug: 'siyar-alam-al-nubala-risalah', volume: 1, volumeLabel: 'السيرة 1', page: 138, url: 'https://shamela.ws/book/10906/276' },
      grading: 'أخرجه البخاري.',
      moments: [
        { title: '«ما زلنا أعزة»', text: 'قال ابن مسعود: ما زلنا أعزة منذ أسلم عمر.', people: ['abdullah-ibn-masud', 'umar-ibn-al-khattab'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default islamOfUmar;
