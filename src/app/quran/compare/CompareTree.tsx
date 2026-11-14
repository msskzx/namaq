'use client';

import { Fragment, useMemo } from 'react';
import MushafText from '@/components/common/MushafText';
import Rope from '@/components/common/Rope';
import { compareTree, endMark, type BraidWord } from '@shared/quran/braid';
import type { CardSide } from '@shared/quran/compareCards';
import type { Branch } from '@shared/quran/branches';
import { num } from '@shared/quran/arabicNumber';
import { likeness } from '@shared/quran/wordMatch';
import type { SpreadAyah } from '@/components/quran/PageSpread';
import BranchTree from '../branches/BranchTree';

/** The ayah numbers ending at this word: on a node both sides share, both sides' numbers, when they differ. */
const ends = (word: BraidWord, other?: BraidWord) => [...new Set([word.end, other?.end].filter((end): end is number => end !== undefined))];

/** A word's colour: on a node both sides share, the exact colour, or the written colour where the two write it differently; else its mark on the card. */
const colourOf = (word: BraidWord, other?: BraidWord) => {
  if (other) return likeness([other.text, word.text]) === 'written' ? 'var(--mark-written)' : 'var(--mark-exact)';
  if (!word.mark) return undefined;
  return word.mark.kind === 'root' ? 'var(--mark-root)' : word.mark.kind === 'related' ? 'color-mix(in srgb, var(--mark-root) 45%, var(--home-muted))' : 'var(--mark-exact)';
};

function Words({ words, other, ar }: { words: BraidWord[]; other?: BraidWord[]; ar: boolean }) {
  return <span lang="ar" className="block font-quran leading-loose">{words.map((word, i) => {
    const colour = colourOf(word, other?.[i]);
    const end = ends(word, other?.[i]);
    return <Fragment key={i}>
      {i > 0 && ' '}
      {word.skip && <span role="separator" aria-label={ar ? `آيات محذوفة، ثم الآية ${num(word.skip)}` : `Ayat left out, then ayah ${word.skip}`} className="text-[var(--home-muted)]">⋯ </span>}
      <span style={colour ? { color: colour } : undefined}><MushafText>{word.text}</MushafText></span>
      {end.length > 0 && <span className="text-[var(--home-accent)]"> {endMark(end, ar)}</span>}
    </Fragment>;
  })}</span>;
}

/** The ayah before or after one side, muted, its words coloured where the other side's neighbour shares them. */
function Neighbour({ ayah, ar }: { ayah: SpreadAyah; ar: boolean }) {
  return <p className="text-center font-quran text-[var(--home-muted)]" style={{ fontSize: '1.2rem' }}>
    {ayah.words.map((word, i) => {
      const kind = ayah.marks?.[i]?.kind;
      return <Fragment key={i}>
        {i > 0 && ' '}
        <span style={kind ? { color: `var(--mark-${kind === 'related' ? 'root' : kind})` } : undefined} className={kind ? 'opacity-80 [:root[data-marks=none]_&]:opacity-100' : undefined}><MushafText>{word}</MushafText></span>
      </Fragment>;
    })}
    {' '}{ar ? num(ayah.number) : ayah.number}
  </p>;
}

function Neighbours({ near, ar }: { near: (SpreadAyah | null)[]; ar: boolean }) {
  if (!near.some(ayah => ayah?.words.length)) return null;
  return <div dir="rtl" className="grid grid-cols-2 gap-2">{near.map((ayah, i) => <div key={i}>{ayah?.words.length ? <Neighbour ayah={ayah} ar={ar} /> : null}</div>)}</div>;
}

/**
 * A compare card's tree, drawn by the branches tree (shared/quran/braid.ts `compareTree`): where the two sides say the same words
 * one box, where they part a box for each side (the first on the right), meeting again on the next common stretch. Tapping a box
 * lights its side's path. The first boxes where the sides part carry the sides' names on their tabs. With the surrounding-ayat
 * switch, the ayah before each side shows above the tree and the ayah after below it.
 */
export default function CompareTree({ sides, titles, ar, around, empty }: { sides: [CardSide, CardSide]; titles: [string, string]; ar: boolean; empty?: string[]; around?: { before: (SpreadAyah | null)[]; after: (SpreadAyah | null)[] } }) {
  const { tree, nodes } = useMemo(() => compareTree(sides), [sides]);
  // The sides' names go on the first boxes where they part; a card that never parts names both on its one box.
  const first = useMemo(() => {
    let node = tree;
    while (node.children.length === 0 && node.rejoin) node = node.rejoin;
    return node.children;
  }, [tree]);
  const content = (node: Branch) => {
    const item = nodes.get(node);
    if (!item) return undefined;
    const side = item.side;
    const tab = side !== undefined ? (first.includes(node) ? titles[side] : undefined) : first.length === 0 && node === tree ? titles.join(' · ') : undefined;
    const silent = side !== undefined && item.words.length === 0 && !sides[side].ayat.length && empty?.[side];
    return {
      tab,
      content: item.words.length ? <Words words={item.words} other={item.other} ar={ar} />
        : silent ? <span className="flex flex-col items-center gap-1 px-2 text-center font-[family-name:var(--font-amiri)] text-sm leading-relaxed text-[var(--home-muted)]"><Rope className="text-[var(--home-rule)]" />{silent}<Rope className="text-[var(--home-rule)]" /></span>
        : <span aria-label={ar ? 'لا كلمات هنا' : 'No words here'} className="m-2 block size-2 rounded-full bg-[var(--home-rule)]" />,
    };
  };
  return (
    <div dir="rtl" className="flex flex-col gap-1" aria-label={ar ? `${titles[0]} و${titles[1]} شجرةً` : `${titles[0]} and ${titles[1]} as a tree`}>
      {around && <Neighbours near={around.before} ar={ar} />}
      <BranchTree tree={tree} names={{}} direction="down" nodeContent={content} zoomBar={false} viewportHeight={null} showSpellings={false} label={ar ? 'شجرة الموضعين' : 'The two passages as a tree'} />
      {around && <Neighbours near={around.after} ar={ar} />}
    </div>
  );
}
