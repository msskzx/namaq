import { itqanAt, itqanCredit, itqanPage, type ItqanData, type ItqanParagraph } from './itqanBalagha';
import type { ExampleView } from './iltifat';

// see docs/plans/balagha.md
export type LataifQuote = { text: string; cite?: string; url?: string };
export type LataifReference = { title: string; quotes: LataifQuote[] };
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const topicOf = (_view: Pick<ExampleView, 'key'>): Topic => TOPICS[0];

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
