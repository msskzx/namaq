import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Undated. Urwah and Mujahid put the building قبل المبعث بخمس عشرة سنة, which
 * counts from the calling and is not a value `hijriYear` holds, so the field is
 * unset the way the birth's and the Isra's are.
 *
 * The arbitration here is where `prophet/al-amin` comes from: they took the
 * first man through the gate as judge and said هذا الأمين رضينا به. Chapter one
 * authored the title from this passage but never the event it happened in.
 */
const rebuildingOfTheKaaba = {
  kind: 'EVENT',
  slug: 'rebuilding-of-the-kaaba',
  name: 'بناء قريش الكعبة ووضع الحجر الأسود',
  nameTransliterated: 'The Rebuilding of the Kaaba',
  type: 'OTHER',
  fields: {
    location: { value: 'مكة', claims: ['sira/kaaba-rebuilding'] },
    description: {
      value:
        'هدمت قريش الكعبة وبنتها حتى بلغوا موضع الحجر الأسود، فاختصموا فيمن يضعه حتى مكثوا أربع ليال، ثم حكموا أول داخل من باب المسجد، فكان رسول الله صلى الله عليه وسلم، فقالوا: هذا الأمين رضينا به. فوضع الركن في ثوب وأمر كل قبيلة أن تأخذ بناحية منه، ثم وضعه بيده وبنى عليه. وكان ينقل الحجارة معهم، فلما وضع إزاره على عاتقه نودي: عورتك، فما رؤيت له عورة بعد.',
      claims: ['sira/kaaba-rebuilding', 'sira/kaaba-awrah'],
    },
  },
  people: [{ person: 'prophet-muhammad', claims: ['sira/kaaba-rebuilding'] }],
} satisfies CatalogEvent;

export default rebuildingOfTheKaaba;
