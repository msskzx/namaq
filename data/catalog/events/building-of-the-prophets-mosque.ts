import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The first event in this batch that takes a hijriYear. Chapters one and two
 * dated things against the calling or against the hijra, neither of which the
 * model holds; chapter three is headed السنة الأولى من الهجرة, so the heading
 * itself dates what sits under it, and every claim here cites it alongside its
 * own passage.
 *
 * Told as a story from Sahih al-Bukhari 3932 (Anas, Manaqib al-Ansar), whole. The building told at the end of the
 * hijra's 3906 stays with that report on hijra-to-medina.ts.
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
    { person: 'abu-bakr-as-siddiq' },
  ],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 3932, 0, 275),
      source: { slug: 'sahih-al-bukhari', hadith: 3932, url: 'https://sunnah.com/bukhari:3932' },
      moments: [
        { title: "نزل في علو المدينة", text: sahih('bukhari', 3932, 276, 457), people: ['prophet-muhammad'] },
        { title: "حتى ألقى بفناء أبي أيوب", text: sahih('bukhari', 3932, 458, 717), people: ['prophet-muhammad', 'abu-bakr-as-siddiq', 'abu-ayyub-al-ansari'] },
        { title: "يصلي حيث أدركته الصلاة", text: sahih('bukhari', 3932, 718, 809), people: ['prophet-muhammad'] },
        { title: "«ثامنوني حائطكم هذا»", text: sahih('bukhari', 3932, 810, 1041), people: ['prophet-muhammad'] },
        { title: "القبور والخرب والنخل", text: sahih('bukhari', 3932, 1042, 1371), people: ['prophet-muhammad'] },
        { title: "«فانصر الأنصار والمهاجرة»", text: sahih('bukhari', 3932, 1372, 1584), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default buildingOfTheProphetsMosque;
