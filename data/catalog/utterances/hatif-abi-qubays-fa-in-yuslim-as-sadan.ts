import type { CatalogUtterance } from '@/lib/catalog/types';

// A voice Quraysh heard on Abu Qubays two nights running, and could not put a
// face to: Abu Sufyan spent the morning guessing which Sa'd it meant.
const hatifAbiQubaysFaInYuslimAsSadan = {
  kind: 'UTTERANCE',
  slug: 'hatif-abi-qubays-fa-in-yuslim-as-sadan',
  utteranceKind: 'POETRY',
  textArabic: { value: 'فإن يسلم السعدان يصبح محمد ... بمكة لا يخشى خلاف المخالف', claims: ['sira/verses-hatif-as-sadan'] },
  fields: {
    speakerName: { value: 'هاتف سمعته قريش على أبي قبيس', claims: ['sira/verses-hatif-as-sadan'] },
    occasion: { value: 'سمعوه في الليل على أبي قبيس قبل أن تعرف قريش من السعدان.', claims: ['sira/verses-hatif-as-sadan'] },
  },
} satisfies CatalogUtterance;

export default hatifAbiQubaysFaInYuslimAsSadan;
