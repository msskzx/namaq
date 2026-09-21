import type { CatalogUtterance } from '@/lib/catalog/types';

/**
 * The verses that turned Abu Sufyan back from returning after Uhud. Ma'bad was
 * a mushrik when he said them and the app has no subject for him, so his name
 * is text: naming a poet the chapter mentions once does not make him a node.
 */
const maabadAlKhuzaiHamraAlAsad = {
  kind: 'UTTERANCE',
  slug: 'maabad-al-khuzai-hamra-al-asad',
  utteranceKind: 'POETRY',
  battle: 'ghazwah-hamra-al-asad',
  textArabic: {
    value: [
      'كادت تهدمن الأصوات راحلتي ... إذ سالت الأرض بالجرد الأبابيل',
      'تردي بأسد كرام لا تنابلة ... عند اللقاء ولا ميل معازيل',
      'فظلت عدوا أظن الأرض مائلة ... لما سموا برئيس غير مخذول',
      'فقلت ويل ابن حرب من لقائكم ... إذا تغطمطت البطحاء بالجيل',
      'إني نذرت لأهل البسل ضاحية ... لكل ذي إربة منهم ومعقول',
      'من جيش أحد لا وخش تنابلة ... وليس يوصف ما أنذرت بالقيل',
    ].join('\n'),
    claims: ['sira/verses-maabad'],
  },
  fields: {
    speakerName: { value: 'معبد الخزاعي', claims: ['sira/verses-maabad'] },
    occasion: {
      value: 'قالها لأبي سفيان بالروحاء وقد أجمعوا الرجعة، فثنى ذلك أبا سفيان ومن معه.',
      claims: ['sira/verses-maabad'],
    },
  },
} satisfies CatalogUtterance;

export default maabadAlKhuzaiHamraAlAsad;
