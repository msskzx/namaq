'use client';

import { useMemo } from 'react';
import Rope from '@/components/common/Rope';
import { compareTree } from '@shared/quran/braid';
import type { CardSide } from '@shared/quran/compareCards';
import type { Branch } from '@shared/quran/branches';
import { writtenLinks } from '@shared/quran/compareCardLook';
import BranchTree from '../branches/BranchTree';

/** No box opens a branches tree of its own: a pair's words are not one of the branches groups. */
const NO_LINKS: Record<string, string> = {};

/**
 * A compare card's tree, drawn by the branches tree as every tree is (shared/quran/braid.ts `compareTree`): where the two sides say
 * the same words one box, where they part a box for each side (the first on the right), meeting again on the next common stretch.
 * Words the sides write differently follow the branches rule (foldStrands). Tapping a box lights its side's path. `around` names the card whose surrounding-ayat switch the tree follows: each side's ayah
 * before and after then joins the tree as on the branches page.
 */
export default function CompareTree({ sides, names, titles, ar, around, empty }: { sides: [CardSide, CardSide]; names: Record<number, string>; titles: [string, string]; ar: boolean; empty?: string[]; around?: string }) {
  const written = useMemo(() => writtenLinks({ sides }), [sides]);
  const { tree, sides: owner } = useMemo(() => compareTree(sides, written), [sides, written]);
  // In a story part one side does not tell, that side's note; elsewhere a side with no words is a line running straight on.
  const renderNode = (node: Branch) => {
    const side = owner.get(node);
    const silent = side !== undefined && !node.words.length && !sides[side].ayat.length && empty?.[side];
    return silent
      ? <span className="flex flex-col items-center gap-1 px-2 text-center font-[family-name:var(--font-amiri)] text-sm leading-relaxed text-[var(--home-muted)]"><Rope className="text-[var(--home-rule)]" />{silent}<Rope className="text-[var(--home-rule)]" /></span>
      : undefined;
  };
  return (
    <div dir="rtl" aria-label={ar ? `${titles[0]} و${titles[1]} شجرةً` : `${titles[0]} and ${titles[1]} as a tree`}>
      <BranchTree tree={tree} names={names} direction="down" renderNode={renderNode} viewportHeight={null} zoomBar={false} subtreeLinks={NO_LINKS}
        surround={around ? { on: false, sync: true, card: around } : undefined} label={ar ? 'شجرة الموضعين' : 'The two passages as a tree'} />
    </div>
  );
}
