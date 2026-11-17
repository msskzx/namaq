import type { DifferenceSide, DifferenceWords as Words } from '@shared/quran/mutashabih/types';

/** First piece of the Quran text module: page words shown inline (the copied-ayah level), here the words two ayat differ by, «a / b». */
function Side({ side }: { side: DifferenceSide }) {
  if (!side.words.length) return <span>∅</span>;
  return <><span className="font-quran">{side.words.join(' ')}</span>{side.more && <span> …</span>}</>;
}

export default function DifferenceWords({ words, className }: { words: Words; className?: string }) {
  return <span data-connection-words lang="ar" dir="rtl" className={className}><Side side={words.a} /> / <Side side={words.b} /></span>;
}
