import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The first event in this batch that takes a hijriYear. Chapters one and two
 * dated things against the calling or against the hijra, neither of which the
 * model holds; chapter three is headed السنة الأولى من الهجرة, so the heading
 * itself dates what sits under it, and every claim here cites it alongside its
 * own passage.
 */
const buildingOfTheProphetsMosque = {
  kind: 'EVENT',
  slug: 'building-of-the-prophets-mosque',
  name: 'بناء المسجد النبوي',
  nameTransliterated: "Building of the Prophet's Mosque",
  type: 'OTHER',
  fields: {
    hijriYear: { value: 1, claims: ['sira/masjid-an-nabawi'] },
    location: { value: 'المدينة، في بني مالك بن النجار', claims: ['sira/masjid-an-nabawi'] },
    description: {
      value:
        'بركت الناقة في مربد لغلامين يتيمين من بني النجار، فقال: يا بني النجار ثامنوني بحائطكم هذا. قالوا: لا نطلب ثمنه إلا إلى الله. فأمر بقبور المشركين فنبشت، وبالخرب فسويت، وبالنخل فقطع، وجعل سواريه من جذوع النخل وسقفه بالجريد، وكان ينقل اللبن معهم ويقول: اللهم لا خير إلا خير الآخره ... فانصر الأنصار والمهاجره.',
      claims: ['sira/masjid-an-nabawi'],
    },
  },
  people: [
    { person: 'prophet-muhammad', claims: ['sira/masjid-an-nabawi'] },
    { person: 'abu-ayyub-al-ansari', claims: ['abu-ayyub/hosts-the-prophet'] },
    { person: 'ammar-ibn-yasir', claims: ['ammar/mosque-two-bricks'] },
  ],
} satisfies CatalogEvent;

export default buildingOfTheProphetsMosque;
