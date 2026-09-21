import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// The seed entry is retired, so this module is the author; what it held and
// no batch cites is carried below with its evidence owed. The chapter puts
// him in the first believers as a boy herding sheep, and ends the story with
// what he took from the Prophet's own mouth, which is the part the model has
// a field for.
const abdullahIbnMasud = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-masud',
  name: 'عبد الله بن مسعود',
  nameTransliterated: 'Abdullah ibn Masud',
  hasProfile: true,
  fields: {
    // Carried from the retired seed entry, which took it from the Siyar
    // without citing it.
    fullName: {
      value:
        'عبد الله بن مسعود بن غافل بن حبيب بن شمخ بن فار بن مخزوم بن صاهلة بن كاهل بن الحارث بن تميم بن سعد بن هذيل الهذلي',
      claims: legacyUnreviewed,
    },
    virtues: {
      value:
        'كان يرعى غنما لعقبة بن أبي معيط فمر به النبي صلى الله عليه وسلم وأبو بكر فحلب لهما من جذعة لم ينز عليها الفحل، فقال له: (إنك غلام معلم) . قال: فأخذت من فيه سبعين سورة ما ينازعني فيها أحد.',
      claims: ['ibn-masud/ghanam'],
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
    { type: 'SON', inverse: 'FATHER', to: 'masud-ibn-ghafil', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdullahIbnMasud;
