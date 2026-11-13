import { Fragment } from 'react';
import MushafText from '@/components/common/MushafText';
import Rope from '@/components/common/Rope';
import { braidOf, endMark, type BraidWord } from '@shared/quran/braid';
import type { CardSide } from '@shared/quran/compareCards';
import { num } from '@shared/quran/arabicNumber';
import { normalizeWord } from '@shared/quran/normalize';
import type { SpreadAyah } from '@/components/quran/PageSpread';

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
      {word.skip && <span role="separator" aria-label={ar ? `آيات محذوفة، ثم الآية ${num(word.skip)}` : `Ayat left out, then ayah ${word.skip}`} className="text-[var(--home-muted)]">⋯ </span>}
      <span style={colour ? { color: colour } : undefined}><MushafText>{word.text}</MushafText></span>
      {ends(word, other?.[i]).length > 0 && <span className="text-[var(--home-accent)]"> {endMark(ends(word, other?.[i]), ar)}</span>}
    </Fragment>;
  });
}

type Row = { kind: 'shared' | 'split' | 'around'; a: BraidWord[]; b: BraidWord[]; near?: (SpreadAyah | null)[] };

/** Two strands meeting in the middle, one parting into two, or both running straight on; the first side runs on the right. */
function Link({ from, to }: { from: Row['kind']; to: Row['kind'] }) {
  if (from !== 'shared' && to !== 'shared') return <div aria-hidden className="grid grid-cols-2" style={{ height: LINK }}>
    {[0, 1].map(i => <span key={i} className="mx-auto h-full w-[1.5px] bg-[var(--home-muted)]" />)}
  </div>;
  const d = to === 'shared' ? 'M75 0 C75 16 50 10 50 26 M25 0 C25 16 50 10 50 26' : 'M50 0 C50 16 75 10 75 26 M50 0 C50 16 25 10 25 26';
  return <svg aria-hidden width="100%" height={LINK} viewBox={`0 0 100 ${LINK}`} preserveAspectRatio="none" className="block">
    <path d={d} stroke="var(--home-muted)" strokeWidth={1.5} fill="none" vectorEffect="non-scaling-stroke" />
  </svg>;
}

/** The ayah before or after one side, muted, its words coloured where the other side's neighbour shares them. */
function Neighbour({ ayah, ar }: { ayah: SpreadAyah; ar: boolean }) {
  return <p className="text-center text-[var(--home-muted)]" style={{ fontSize: '1.2rem' }}>
    {ayah.words.map((word, i) => {
      const kind = ayah.marks?.[i]?.kind;
      return <Fragment key={i}>
        {i > 0 && ' '}
        <span style={kind ? { color: kind === 'root' ? 'var(--home-root)' : 'var(--home-accent)', opacity: 0.8 } : undefined}><MushafText>{word}</MushafText></span>
      </Fragment>;
    })}
    {' '}{ar ? num(ayah.number) : ayah.number}
  </p>;
}

const NODE = 'max-w-full rounded-[var(--card-radius)] px-3 py-0.5 text-center';
const STEM = 'w-[1.5px] flex-1 bg-[var(--home-muted)]';

/**
 * A compare card as a tree: a braid. The two sides run as one node (green frame) where they say the same words,
 * part where they differ, and rejoin on the next common stretch of two words or more. With the surrounding-ayat
 * switch, the ayah before each side opens the tree and the ayah after closes it.
 */
export default function CompareBraid({ sides, titles, ar, around, empty }: { sides: [CardSide, CardSide]; titles: [string, string]; ar: boolean; empty?: string[]; around?: { before: (SpreadAyah | null)[]; after: (SpreadAyah | null)[] } }) {
  const rows: Row[] = [
    ...(around ? [{ kind: 'around' as const, a: [], b: [], near: around.before }] : []),
    ...braidOf(sides),
    ...(around ? [{ kind: 'around' as const, a: [], b: [], near: around.after }] : []),
  ];
  return (
    <div dir="rtl" className="flex flex-col" aria-label={ar ? `${titles[0]} و${titles[1]} شجرةً` : `${titles[0]} and ${titles[1]} as a tree`}>
      <div className="mb-1 grid grid-cols-2 text-center text-sm text-[var(--home-muted)]">
        {titles.map(title => <span key={title}>{title}</span>)}
      </div>
      <div lang="ar" className="flex flex-col" style={{ fontFamily: 'var(--font-quran)', fontSize: '1.4rem', lineHeight: 2.2 }}>
        {rows.map((row, r) => (
          <div key={r}>
            {r > 0 && <Link from={rows[r - 1].kind} to={row.kind} />}
            {row.kind === 'shared'
              ? <p className="flex justify-center"><span className={`${NODE} border-2 border-[var(--home-green)] font-semibold`}><Words words={row.a} other={row.b} ar={ar} /></span></p>
              // No gap between the columns, so their centres sit exactly at the links' 25% and 75%. Each strand runs on
              // under a shorter node to the row's foot, so the next link starts where the line ends.
              : <div className="grid grid-cols-2">
                {[row.a, row.b].map((words, i) => {
                  const near = row.near?.[i];
                  return <div key={i} className="flex flex-col items-center px-1">
                    {row.kind === 'around' && r > 0 && near && <span className="h-2 w-[1.5px] bg-[var(--home-muted)]" />}
                    {row.kind === 'around'
                      ? (near?.words.length ? <Neighbour ayah={near} ar={ar} /> : <span className="min-h-4 flex-1" />)
                      : words.length
                        ? <span className={`${NODE} border border-[var(--home-rule)]`}><Words words={words} ar={ar} /></span>
                        : sides[i].ayat.length === 0 && empty?.[i]
                          ? <span className="flex flex-col items-center gap-1 px-2 text-center font-[family-name:var(--font-amiri)] text-sm leading-relaxed text-[var(--home-muted)]"><Rope className="text-[var(--home-rule)]" />{empty[i]}<Rope className="text-[var(--home-rule)]" /></span>
                          : <span aria-label={ar ? 'لا كلمات هنا' : 'No words here'} className="size-2 rounded-full bg-[var(--home-rule)]" />}
                    {r < rows.length - 1 && (row.kind !== 'around' || near?.words.length) && <span className={`${STEM} ${words.length || near ? 'min-h-2' : 'min-h-4'}`} />}
                  </div>;
                })}
              </div>}
          </div>
        ))}
      </div>
    </div>
  );
}
