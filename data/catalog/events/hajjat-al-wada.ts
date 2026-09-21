import { legacyUnreviewed, type CatalogEvent } from '@/lib/catalog/types';

/**
 * The old seed never had it, so the catalog creates the row, the way it does
 * for a سرية the seeds never held.
 *
 * The chapter dates the departure to لخمس بقين من ذي القعدة, or four, and the
 * year is its own heading, السنة العاشرة. A month within a year the section
 * states is not the same as a heading two pages up standing in for a date the
 * section never gives — which is why Tabuk's year stayed owed in chapter
 * eleven and this one does not.
 *
 * أسماء بنت عميس is here because the chapter puts her here: she bore محمد بن
 * أبي بكر at ذو الحليفة on the way out, and asked the Prophet what to do. Her
 * son has no subject, so the birth is not a second event; it is what she did
 * at this one.
 */
const hajjatAlWada = {
  kind: 'EVENT',
  slug: 'hajjat-al-wada',
  name: 'حجة الوداع',
  nameTransliterated: 'The Farewell Pilgrimage',
  type: 'TRAVEL',
  fields: {
    description: {
      value:
        'أذن رسول الله صلى الله عليه وسلم في الناس بالحج، فاجتمع في المدينة بشر كثير، وخرج لخمس بقين من ذي القعدة.',
      claims: ['hajjat-al-wada/description'],
    },
    // The chapter's own heading, السنة العاشرة, and the section dates the
    // departure inside it rather than leaving the year to be inferred.
    hijriYear: { value: 10, claims: legacyUnreviewed },
  },
  people: [
    { person: 'prophet-muhammad', claims: ['prophet/hajjat-al-wada'] },
    { person: 'asma-bint-umays', claims: ['asma-umays/hajjat-al-wada'] },
  ],
} satisfies CatalogEvent;

export default hajjatAlWada;
