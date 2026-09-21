import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Not an occasion with a day, but the chapter treats it as one thing under one
 * heading, and the model has no other shape for a stretch of time. The roster
 * is the seven the narration names, minus the two it says were protected --
 * they are on it, because being spared is part of what the passage records
 * about them.
 *
 * Sumayyah's killing is here rather than in a death event of its own: the
 * chapter gives it as a sentence inside the persecution, not as a narration
 * with its own occasion.
 */
const persecutionOfTheEarlyMuslims = {
  kind: 'EVENT',
  slug: 'persecution-of-the-early-muslims',
  name: 'أذية المشركين للمسلمين بمكة',
  nameTransliterated: 'The Persecution of the Early Muslims',
  type: 'OTHER',
  fields: {
    location: { value: 'مكة', claims: ['sira/first-seven'] },
    description: {
      value:
        'أول من أظهر إسلامه سبعة: رسول الله صلى الله عليه وسلم، وأبو بكر، وعمار، وأمه سمية، وصهيب، وبلال، والمقداد. فمنع الله رسوله بعمه أبي طالب، ومنع أبا بكر بقومه، وأما سائرهم فألبسهم المشركون أدراع الحديد وأوقفوهم في الشمس. وكان بلال يطاف به في شعاب مكة وهو يقول: أحد أحد. ومر النبي صلى الله عليه وسلم بآل عمار وهم يعذبون فقال: (أبشروا آل عمار فإن موعدكم الجنة) . وكانت سمية أول شهيد في الإسلام، طعنها أبو جهل بحربة.',
      claims: ['sira/first-seven', 'bilal/persecution', 'ammar/persecution', 'sumayyah/first-martyr'],
    },
  },
  people: [
    { person: 'prophet-muhammad', claims: ['sira/first-seven'] },
    { person: 'abu-bakr-as-siddiq', claims: ['abu-bakr/first-seven'] },
    { person: 'ammar-ibn-yasir', claims: ['ammar/persecution'] },
    { person: 'sumayyah-bint-khayyat', claims: ['sumayyah/first-martyr'] },
    { person: 'suhaib-ibn-sinan', claims: ['suhayb/first-seven'] },
    { person: 'bilal-ibn-rabah', claims: ['bilal/persecution'] },
    { person: 'al-miqdad-ibn-amr', claims: ['miqdad/first-seven'] },
  ],
} satisfies CatalogEvent;

export default persecutionOfTheEarlyMuslims;
