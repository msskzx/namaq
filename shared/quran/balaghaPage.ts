import { itqanAt, itqanCredit, itqanPage, type ItqanData, type ItqanParagraph } from './itqanBalagha';
import type { ExampleView } from './iltifat';

/**
 * The balagha page (owner, 2026-11-16; docs/plans/balagha.md): a curated list of examples, each drawn with a picture of
 * its own, grouped by device. Each device and each example carries its reference: al-Suyuti's own words in al-Itqan
 * where he gives the example, otherwise the note it came with.
 */
export type BalaghaQuote = { text: string; cite?: string; url?: string };
export type BalaghaReference = { title: string; quotes: BalaghaQuote[] };
export type Device = { name: string; heading: string; reference: BalaghaReference };

export const DEVICES: Device[] = [
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

/** Every example on the page so far is an iltifat; the view picks the device once others come. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const deviceOf = (_view: Pick<ExampleView, 'key'>): Device => DEVICES[0];

/**
 * An example's reference: al-Suyuti's paragraphs under the device's heading that quote one of its ayat, whole, each
 * with its page, then the note the example came with (it names the other books it is drawn from); with none, that
 * note alone, its first clause as the title.
 */
export function exampleReference(view: Pick<ExampleView, 'key' | 'surah' | 'from' | 'to' | 'source'>, data: ItqanData): BalaghaReference {
  const device = deviceOf(view);
  const seen = new Set<string>();
  const paragraphs: ItqanParagraph[] = [];
  for (let ayah = view.from; ayah <= view.to; ayah++) {
    for (const paragraph of itqanAt(data, `${view.surah}:${ayah}`)) {
      if (paragraph.heading !== device.heading || seen.has(paragraph.text)) continue;
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
