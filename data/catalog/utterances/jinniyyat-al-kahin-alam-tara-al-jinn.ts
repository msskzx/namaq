import type { CatalogUtterance } from '@/lib/catalog/types';

/**
 * From the story Umar drew out of a man he took for a former kahin, who said
 * his jinniyyah came to him in fear with these lines. The speaker is what the
 * account calls her and no more; nothing here is a subject the app holds.
 */
const jinniyyatAlKahinAlamTaraAlJinn = {
  kind: 'UTTERANCE',
  slug: 'jinniyyat-al-kahin-alam-tara-al-jinn',
  utteranceKind: 'POETRY',
  textArabic: {
    value: [
      'ألم تر الجن وإبلاسها ... ويأسها بعد وإبلاسها',
      'ولحوقها بالقلاص وأحلاسها ... وإياسها من أنساكها',
    ].join('\n'),
    claims: ['sira/verses-jinniyyat-al-kahin'],
  },
  fields: {
    speakerName: { value: 'جنية كاهن من كهان الجاهلية', claims: ['sira/verses-jinniyyat-al-kahin'] },
    occasion: { value: 'جاءت كاهنها يعرف فيها الفزع فأنشدته، فكان ذلك من خبر إسلامه.', claims: ['sira/verses-jinniyyat-al-kahin'] },
  },
} satisfies CatalogUtterance;

export default jinniyyatAlKahinAlamTaraAlJinn;
