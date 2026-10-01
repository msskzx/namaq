import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Read in full from data/history/batches/abdullah-ibn-abdullah-ibn-ubayy
 * (Siyar entry 65, vol. 4 pp. 321-323). `sex` stays on the legacy marker: the
 * entry uses masculine grammar throughout but never states his sex as a fact.
 * The gold nose and tooth, the shirt the Prophet put on him, and the intended
 * kingship stay in the source text -- the catalog has no field for them.
 */
const abdullahIbnAbdullahIbnUbayy = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-abdullah-ibn-ubayy',
  name: 'عبد الله بن عبد الله بن أبي',
  nameTransliterated: 'Abdullah ibn Abdullah ibn Ubayy',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عبد الله بن عبد الله بن أبي بن مالك بن الحارث بن عبيد بن مالك بن سالم بن غنم بن عوف بن الخزرج الأنصاري الخزرجي',
      claims: ['abdullah-ibn-abdullah-ibn-ubayy-siyar65/full-name'],
    },
    tribalAffiliation: {
      value: 'الأنصاري، الخزرجي',
      claims: ['abdullah-ibn-abdullah-ibn-ubayy-siyar65/tribal-affiliation'],
    },
    virtues: {
      value:
        'كان اسمه الحبّاب، وبه كان أبوه يكنى، فغيّره النبي وسمّاه عبد الله. أصيب أنفه يوم أحد فأمره النبي أن يتخذ أنفاً من ذهب، وندرت ثنيته فأمره أن يتخذ ثنية من ذهب. استشهد يوم اليمامة، وقد مات أبوه سنة تسع، فألبسه النبي قميصه وصلى عليه واستغفر له إكراماً لولده حتى نزلت: ولا تصل على أحد منهم مات أبداً ولا تقم على قبره. وكان رئيساً مطاعاً، عزم أهل المدينة قبل أن يهاجر النبي على أن يملّكوه عليهم، فانحل أمره، ولا حصل دنيا ولا آخرة.',
      claims: ['abdullah-ibn-abdullah-ibn-ubayy-siyar65/virtues'],
    },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['abdullah-ibn-abdullah-ibn-ubayy-siyar65/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'abdullah-ibn-ubayy',
      claims: ['abdullah-ibn-abdullah-ibn-ubayy-siyar65/father'],
    },
  ],
} satisfies CatalogPerson;

export default abdullahIbnAbdullahIbnUbayy;
