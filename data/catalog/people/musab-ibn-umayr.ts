import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/musab-ibn-umayr in addition to the
// earlier prophet-muhammad-sira batch. Sent to Medina after the first Aqaba
// to teach the Qur'an, which is how Sa'd ibn Mu'adh and his whole clan came
// to Islam.
const musabIbnUmayr = {
  kind: 'PERSON',
  slug: 'musab-ibn-umayr',
  name: 'مصعب بن عمير',
  nameTransliterated: 'Musab ibn Umayr',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['musab/sex'] },
    fullName: {
      value: 'مصعب بن عمير بن هاشم بن عبد مناف بن عبد الدار بن قصي بن كلاب، القرشي، العبدري.',
      claims: ['musab/full-name'],
    },
    virtues: {
      value:
        'بعثه رسول الله صلى الله عليه وسلم إلى المدينة يقرئهم ويفقههم في الدين، فكان يسمى بها المقرئ، وكان أول من جمع الجمعة بالمدينة.',
      claims: ['musab/madinah-muqri'],
    },
  },
  titles: [
    // Carried from the retired seed entry. The Siyar entry never calls him
    // صحابي in so many words, so this stays legacy rather than promoted.
    { title: 'companion', claims: legacyUnreviewed },
    { title: 'martyr', claims: ['musab/titles'] },
    { title: 'al-sabiqoon', claims: ['musab/titles'] },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'umayr-ibn-hashim', claims: ['musab/father'] },
    // The Siyar entry is silent on his maternal uncle in this range, so this
    // stays legacy.
    {
      type: 'MATERNAL_UNCLE',
      inverse: 'MATERNAL_NEPHEW',
      to: 'shaybah-ibn-uthman',
      claims: legacyUnreviewed,
    },
  ],
} satisfies CatalogPerson;

export default musabIbnUmayr;
