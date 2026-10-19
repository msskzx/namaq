import React from 'react';
import Link from 'next/link';
import { num } from '@/lib/quran/arabicNumber';
import { branch, branchesHref, shown, variants, type BranchAyah, type Opening, type Piece } from '@/lib/quran/branches';
import type { JuzRange } from '@/lib/quran/juz';
import { NOTE } from '../panel';
import BranchTree from './BranchTree';

export const PER_PAGE = 20;

type Props = { names: Record<number, string>; ayat: Map<string, BranchAyah>; juz: JuzRange | null };

const counted = (n: number, [one, two, few]: [string, string, string]) => (n === 1 ? one : n === 2 ? two : `${num(n)} ${n <= 10 ? few : one}`);
const ayatCount = (n: number) => counted(n, ['آية', 'آيتان', 'آيات']);

function Entry({ piece, names, ayat, juz, partOf }: Props & { piece: Piece; partOf: boolean }) {
  const group = piece.keys.map(key => ayat.get(key)!);
  return (
    <li className="flex flex-col gap-1">
      <p className={NOTE}>
        {ayatCount(piece.count)}
        {partOf && piece.opening.count > piece.count && (
          <>
            {' · من: '}
            <Link href={branchesHref(piece.opening.id, juz ?? undefined)} className="font-arabic text-amber-700 dark:text-amber-300 hover:underline">
              {`${piece.opening.text} (${num(piece.opening.count)})`}
            </Link>
          </>
        )}
      </p>
      <BranchTree
        tree={branch(shown(group))}
        variants={variants(group)}
        names={names}
        pages={Object.fromEntries(group.map(ayah => [ayah.key, ayah.page]))}
        juz={juz}
      />
    </li>
  );
}

// docs/plans/quran-shared-openings.md
export default function PieceList({ pieces, openings, juz, ...props }: Props & { pieces: Piece[]; openings?: Opening[] }) {
  if (!openings) {
    return (
      <ul aria-label="المتشابهات" className="flex flex-col gap-4">
        {pieces.map(piece => <Entry key={piece.id} piece={piece} partOf juz={juz} {...props} />)}
      </ul>
    );
  }
  return (
    <ul aria-label="الفواتح" className="flex flex-col gap-2">
      {openings.map(opening => {
        const inside = pieces.filter(piece => piece.opening.id === opening.id);
        return (
          <li key={opening.id}>
            <details className="rounded-lg border border-amber-400 px-3 py-2">
              <summary className="cursor-pointer">
                <span className="text-xl font-arabic leading-loose">{opening.text}</span>
                <span className={`${NOTE} ms-2`}>{`${ayatCount(opening.count)} · ${counted(inside.length, ['مجموعة', 'مجموعتان', 'مجموعات'])}`}</span>
              </summary>
              <Link href={branchesHref(opening.id, juz ?? undefined)} className="text-sm text-amber-700 dark:text-amber-300 hover:underline">الشجرة كاملة</Link>
              <ul className="flex flex-col gap-4 mt-2">
                {inside.map(piece => <Entry key={piece.id} piece={piece} partOf={false} juz={juz} {...props} />)}
              </ul>
            </details>
          </li>
        );
      })}
    </ul>
  );
}
