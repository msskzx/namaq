import { itqanAt, itqanCredit, itqanPage, type ItqanData, type ItqanParagraph } from './itqanBalagha';
import type { ExampleView } from './iltifat';

/**
 * The lata'if page (owner, 2026-11-16; docs/plans/balagha.md): a gallery of curated examples on any topic (a turn of
 * address, a choice between near-synonyms, the kinds of a word's meanings), each drawn with a picture of its own and
 * maybe animated later. Never a complete set, unlike compare and branches; a topic that grows can get a page of its
 * own. Each topic and each example carries its reference: a scholar's own words where he gives the example (al-Suyuti
 * in al-Itqan for iltifat), otherwise the note it came with.
 */
export type LataifQuote = { text: string; cite?: string; url?: string };
export type LataifReference = { title: string; quotes: LataifQuote[] };
/** A topic: its name, al-Suyuti's heading for it in al-Itqan's balagha chapters, and its reference. */
export type Topic = { name: string; heading: string; reference: LataifReference };

export const TOPICS: Topic[] = [
  {
    name: 'الالتفات',
    heading: 'الِالْتِفَاتُ',
    reference: {
      title: 'الالتفات في الإتقان للسيوطي ٣/٢٨٩',
      quotes: [
        { text: 'نَقْلُ الْكَلَامِ مِنْ أُسْلُوبٍ إِلَى آخَرَ أَعْنِي مِنَ الْمُتَكَلِّمِ أَوِ الْخِطَابِ أَوِ الْغَيْبَةِ إِلَى آخَرَ مِنْهَا بَعْدَ التَّعْبِيرِ بِالْأَوَّلِ وَهَذَا هُوَ الْمَشْهُورُ', cite: 'الإتقان للسيوطي ٣/٢٨٩', url: 'https://shamela.ws/book/11728/1053' },
        { text: 'النص برواية حفص. لم يراجع هذه الأمثلة أحد من أهل العلم.' },
      ],
    },
  },
];

/** Every example on the page so far is an iltifat; the view picks the topic once others come. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const topicOf = (_view: Pick<ExampleView, 'key'>): Topic => TOPICS[0];

/**
 * An example's reference: al-Suyuti's paragraphs under the topic's heading that quote one of its ayat, whole, each
 * with its page, then the note the example came with (it names the other books it is drawn from); with none, that
 * note alone, its first clause as the title.
 */
export function exampleReference(view: Pick<ExampleView, 'key' | 'surah' | 'from' | 'to' | 'source'>, data: ItqanData): LataifReference {
  const topic = topicOf(view);
  const seen = new Set<string>();
  const paragraphs: ItqanParagraph[] = [];
  for (let ayah = view.from; ayah <= view.to; ayah++) {
    for (const paragraph of itqanAt(data, `${view.surah}:${ayah}`)) {
      if (paragraph.heading !== topic.heading || seen.has(paragraph.text)) continue;
      seen.add(paragraph.text);
      paragraphs.push(paragraph);
    }
  }
  const note = { text: view.source };
  if (!paragraphs.length) return { title: view.source.split(':')[0], quotes: [note] };
  return {
    title: itqanCredit(paragraphs[0]),
    quotes: [...paragraphs.map(paragraph => ({ text: paragraph.text, cite: itqanCredit(paragraph), url: itqanPage(paragraph) })), note],
  };
}
