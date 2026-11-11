import { Fragment } from 'react';
import MushafText from '@/components/common/MushafText';
import { braidOf, type BraidWord } from '@shared/quran/braid';
import type { CardSide } from '@shared/quran/compareCards';
import { num } from '@shared/quran/arabicNumber';
import { normalizeWord } from '@shared/quran/normalize';

const LINK = 26;

/** The ayah numbers ending at this word: in a shared node both sides' numbers, when they differ. */
const ends = (word: BraidWord, other?: BraidWord) => [...new Set([word.end, other?.end].filter((end): end is number => end !== undefined))];

const colourOf = (word: BraidWord, other?: BraidWord) => {
  if (other) return other.text !== word.text && normalizeWord(other.text) === normalizeWord(word.text) ? 'var(--home-amber)' : undefined;
  if (!word.mark) return undefined;
  return word.mark.kind === 'root' ? 'var(--home-root)' : word.mark.kind === 'related' ? 'color-mix(in srgb, var(--home-root) 45%, var(--home-muted))' : 'var(--home-accent)';
};

/** Words of one node: the card's colours, or amber in a shared node where the two spellings differ in tashkeel. */
function Words({ words, other, ar }: { words: BraidWord[]; other?: BraidWord[]; ar: boolean }) {
  return words.map((word, i) => {
    const colour = colourOf(word, other?.[i]);
    return <Fragment key={i}>
      {i > 0 && ' '}
      <span style={colour ? { color: colour } : undefined}><MushafText>{word.text}</MushafText></span>
      {ends(word, other?.[i]).length > 0 && <span className="text-[var(--home-accent)]"> {ends(word, other?.[i]).map(end => (ar ? num(end) : end)).join(' · ')}</span>}
    </Fragment>;
  });
}

/** Two strands meeting in the middle (`join`) or one parting into two; the first side runs on the right. */
function Link({ join }: { join: boolean }) {
  const d = join ? 'M75 0 C75 16 50 10 50 26 M25 0 C25 16 50 10 50 26' : 'M50 0 C50 16 75 10 75 26 M50 0 C50 16 25 10 25 26';
  return <svg aria-hidden width="100%" height={LINK} viewBox={`0 0 100 ${LINK}`} preserveAspectRatio="none" className="block">
    <path d={d} stroke="var(--home-muted)" strokeWidth={1.5} fill="none" vectorEffect="non-scaling-stroke" />
  </svg>;
}

const NODE = 'max-w-full rounded-xl px-3 py-0.5 text-center';

/**
 * A compare card as a tree: a braid. The two sides run as one node (green frame) where they say the same words,
 * part where they differ, and rejoin on the next common stretch of two words or more.
 */
export default function CompareBraid({ sides, titles, ar }: { sides: [CardSide, CardSide]; titles: [string, string]; ar: boolean }) {
  const strands = braidOf(sides);
  return (
    <div dir="rtl" className="flex flex-col" aria-label={ar ? `${titles[0]} و${titles[1]} شجرةً` : `${titles[0]} and ${titles[1]} as a tree`}>
      <div className="mb-1 grid grid-cols-2 gap-2 text-center text-sm text-[var(--home-muted)]">
        {titles.map(title => <span key={title}>{title}</span>)}
      </div>
      <div lang="ar" className="flex flex-col" style={{ fontFamily: 'var(--font-quran)', fontSize: '1.4rem', lineHeight: 2.2 }}>
        {strands.map((strand, row) => (
          <div key={row}>
            {row > 0 && <Link join={strand.kind === 'shared'} />}
            {strand.kind === 'shared'
              ? <p className="flex justify-center"><span className={`${NODE} border-2 border-[var(--home-green)] font-semibold`}><Words words={strand.a} other={strand.b} ar={ar} /></span></p>
              : <div className="grid grid-cols-2 items-start gap-2">
                {[strand.a, strand.b].map((words, i) => (
                  <p key={i} className="flex justify-center">
                    {words.length
                      ? <span className={`${NODE} border border-[var(--home-rule)]`}><Words words={words} ar={ar} /></span>
                      : <span aria-label={ar ? 'لا كلمات هنا' : 'No words here'} className="mt-4 size-2 rounded-full bg-[var(--home-rule)]" />}
                  </p>
                ))}
              </div>}
          </div>
        ))}
      </div>
    </div>
  );
}
