import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Quraysh sought rain through him while he was still a boy, before the
 * prophethood, so the chapter dates it by nothing and `hijriYear` is unset.
 *
 * Recorded LIKELY, not ESTABLISHED. al-Dhahabi reports it on one chain and
 * grades it neither way, while grading what sits on either side of it: he calls
 * the Bahira report حديث منكر جدا with four reasons, and marks the very next
 * report عبد الله بن شبيب وهو ضعيف. He lets this one stand, which is weaker
 * than authenticating it and stronger than the silence around a rejected one.
 *
 * Abu Talib's three verses follow the account as his own words about it, and
 * the description keeps the first, the one the poem is known by.
 */
const istisqaByAbuTalib = {
  kind: 'EVENT',
  slug: 'istisqa-by-abu-talib',
  name: 'الاستسقاء بالنبي ﷺ وهو غلام',
  nameTransliterated: 'Seeking Rain Through the Prophet as a Boy',
  type: 'OTHER',
  fields: {
    location: { value: 'المسجد الحرام بمكة', claims: ['sira/istisqa-bi-an-nabi'] },
    description: {
      value:
        'أقحط الوادي فأتت قريش أبا طالب فقالوا: هلم فاستسق. فخرج ومعه غلام، فألصق ظهره بالكعبة ولاذ بأصبعه الغلام، وما في السماء قزعة، فأقبل السحاب من ههنا وههنا وأغدق واغدودق وانفجر له الوادي، وأخصب النادي والبادي. وفي ذلك يقول أبو طالب: وأبيض يستسقى الغمام بوجهه ... ربيع اليتامى عصمة للأرامل.',
      claims: ['sira/istisqa-bi-an-nabi', 'abu-talib/istisqa'],
    },
  },
  people: [
    { person: 'prophet-muhammad', claims: ['sira/istisqa-bi-an-nabi'] },
    { person: 'abu-talib', claims: ['abu-talib/istisqa'] },
  ],
} satisfies CatalogEvent;

export default istisqaByAbuTalib;
