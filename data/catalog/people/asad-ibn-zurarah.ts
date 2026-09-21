import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// The seed entry is retired, so this module is the author; what it held and
// no batch cites is carried below with its evidence owed. The Prophet left
// his naqib place unfilled and took it himself, which the chapter says Banu
// al-Najjar took pride in.
const asadIbnZurarah = {
  kind: 'PERSON',
  slug: 'asad-ibn-zurarah',
  name: 'أسعد بن زرارة',
  nameTransliterated: 'Asad ibn Zurarah',
  hasProfile: true,
  fields: {
    // Carried from the retired seed entry, which took it from the Siyar
    // without citing it.
    fullName: {
      value:
        'أسعد بن زرارة بن عدس بن عبيد بن ثعلبة بن غنم بن مالك بن النجار الأنصاري الخزرجي النجاري',
      claims: legacyUnreviewed,
    },
    sex: { value: 'MALE', claims: ['asad/sex'] },
    virtues: {
      value:
        'كان من سادة الأنصار ومن نقبائهم الأبرار، ولم يجعل النبي صلى الله عليه وسلم على بني النجار بعده نقيبا وقال: (أنا نقيبكم) ، فكانوا يفخرون بذلك.',
      claims: ['asad/naqib'],
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
    { type: 'SON', inverse: 'FATHER', to: 'zurarah-ibn-udas', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default asadIbnZurarah;
