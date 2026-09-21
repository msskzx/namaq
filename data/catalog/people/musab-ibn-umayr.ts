import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// The seed entry is retired, so this module is the author; what it held and
// no batch cites is carried below with its evidence owed. Sent to Medina
// after the first Aqaba to teach the Qur'an, which is how Sa'd ibn Mu'adh
// and his whole clan came to Islam.
const musabIbnUmayr = {
  kind: 'PERSON',
  slug: 'musab-ibn-umayr',
  name: 'مصعب بن عمير',
  nameTransliterated: 'Musab ibn Umayr',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['musab/sex'] },
    virtues: {
      value:
        'بعثه رسول الله صلى الله عليه وسلم إلى المدينة يقرئهم ويفقههم في الدين، فكان يسمى بها المقرئ، وكان أول من جمع الجمعة بالمدينة.',
      claims: ['musab/madinah-muqri'],
    },
  },
  titles: [
    // Carried from the retired seed entry. The seeds gave every صحابي this
    // title without citing it.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    // Carried from neo4j/graphSeedData*.ts, which stated these ties without
    // citing them. The catalog owns this subject's edges now, so they live
    // here or not at all.
    { type: 'SON', inverse: 'FATHER', to: 'umayr-ibn-hashim', claims: legacyUnreviewed },
    {
      type: 'MATERNAL_UNCLE',
      inverse: 'MATERNAL_NEPHEW',
      to: 'shaybah-ibn-uthman',
      claims: legacyUnreviewed,
    },
  ],
} satisfies CatalogPerson;

export default musabIbnUmayr;
