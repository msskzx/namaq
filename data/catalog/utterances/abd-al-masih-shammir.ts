import type { CatalogUtterance } from '@/lib/catalog/types';

// The second half of the same rejected report: what he said on the way back
// after Satih died. Same speaker, same verdict.
const abdAlMasihShammir = {
  kind: 'UTTERANCE',
  slug: 'abd-al-masih-shammir',
  utteranceKind: 'POETRY',
  textArabic: {
    value: [
      'شمر فإنك ماضي الهم شمير ... لا يفزعنك تفريق وتغيير',
      'إن يمس ملك بني ساسان أفرطهم ... فإن ذا الدهر أطوار دهارير',
      'فربما ربما أضحضوا بمنزلة ... تهاب صولهم الأسد المهاصير',
      'منهم أخو الصرح بهرام وإخوته ... والهرمزان وسابور وسابور',
      'والناس أولاد علات فمن علموا ... أن قد أقل فمحقور ومهجور',
      'وهم بنو الأم إما إن رأوا نشبا ... فذاك بالغيب محفوظ ومنصور',
      'والخير والشر مصفودان في قرن ... فالخير متبع والشر محذور'
    ].join('\n'),
    claims: ['sira/verses-abd-al-masih-shammir'],
  },
  fields: {
    speakerName: { value: 'عبد المسيح بن بقيلة الغساني', claims: ['sira/verses-abd-al-masih-shammir'] },
    grading: { value: 'هذا حديث منكر غريب', claims: ['sira/verses-abd-al-masih-shammir'] },
    occasion: { value: 'قالها وهو سائر إلى رحله بعد أن قضى سطيح مكانه.', claims: ['sira/verses-abd-al-masih-shammir'] },
  },
} satisfies CatalogUtterance;

export default abdAlMasihShammir;
