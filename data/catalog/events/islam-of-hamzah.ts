import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Abu Jahl is in the narration and not on the roster: the app has no subject
 * for him, and a name the chapter mentions is not on its own a reason to make
 * one. The description keeps him, the way it keeps the mawlat of Ibn Jud'an
 * who carried the news.
 */
const islamOfHamzah = {
  kind: 'EVENT',
  slug: 'islam-of-hamzah',
  name: 'إسلام حمزة بن عبد المطلب',
  nameTransliterated: 'The Islam of Hamzah ibn Abd al-Muttalib',
  type: 'OTHER',
  fields: {
    location: { value: 'مكة', claims: ['hamzah/islam'] },
    description: {
      value:
        'آذى أبو جهل النبي صلى الله عليه وسلم عند الصفا وشتمه فلم يكلمه، فبلغ ذلك حمزة وهو راجع من قنصه، فخرج إليه حتى قام على رأسه فضربه بالقوس فشجه، ثم قال: أتشتمه! فأنا على دينه أقول ما يقول. وتم حمزة على إسلامه، فعرفت قريش أن رسول الله صلى الله عليه وسلم قد عز وامتنع، فكفوا بعض الشيء.',
      claims: ['hamzah/islam', 'hamzah/virtues-islam'],
    },
  },
  people: [
    { person: 'hamzah-ibn-abd-al-muttalib', claims: ['hamzah/islam'] },
    { person: 'prophet-muhammad', claims: ['hamzah/islam'] },
  ],
} satisfies CatalogEvent;

export default islamOfHamzah;
