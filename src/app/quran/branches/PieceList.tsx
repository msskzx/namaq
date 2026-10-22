'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageContext';
import { num } from '@/lib/quran/arabicNumber';
import { branch, branchesHref, variants, type BranchAyah, type BranchesView, type Opening, type Piece } from '@/lib/quran/branches';
import type { JuzRange } from '@/lib/quran/juz';
import BranchTree from './BranchTree';
const NOTE = 'text-sm text-[var(--home-muted)]';

export const PER_PAGE = 10;

type Props = { names: Record<number, string>; ayat: Map<string, BranchAyah>; juz: JuzRange | null; view?: BranchesView };

const counted = (n: number, [one, two, few]: [string, string, string]) => (n === 1 ? one : n === 2 ? two : `${num(n)} ${n <= 10 ? few : one}`);
const ayatCount = (n: number) => counted(n, ['آية', 'آيتان', 'آيات']);

function Entry({ piece, names, ayat, juz, partOf, view }: Props & { piece: Piece; partOf: boolean }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const group = piece.keys.map(key => ayat.get(key)!);
  return (
    <li>
      <BranchTree
        header={<p className={NOTE}>
          {ar ? ayatCount(piece.count) : `${piece.count} ayat`}
          {partOf && piece.opening.count > piece.count && <>
            {ar ? ' · من: ' : ' · From: '}
            <Link href={branchesHref(piece.opening.id, juz ?? undefined, { ...view, spelling: undefined, partition: piece.opening.partition })} className="font-arabic text-[var(--home-accent)] hover:underline">
              {`${piece.opening.text} (${ar ? num(piece.opening.count) : piece.opening.count})`}
            </Link>
          </>}
        </p>}
        tree={branch(group)} variants={variants(group)} names={names}
        pages={Object.fromEntries(group.map(ayah => [ayah.key, ayah.page]))} juz={juz} view={view}
      />
    </li>
  );
}

export default function PieceList({ pieces, openings, juz, ...props }: Props & { pieces: Piece[]; openings?: Opening[] }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  if (!pieces.length) return <p role="status" className={NOTE}>{ar ? 'لا تشترك آيتان في فاتحة داخل هذه الأجزاء.' : 'No two ayat share an opening in this juz range.'}</p>;
  if (!openings) return <ul aria-label={ar ? 'المتشابهات' : 'Shared entries'} className="flex flex-col gap-4">
    {pieces.map((piece, index) => <Entry key={`${piece.id}:${index}`} piece={piece} partOf juz={juz} {...props} />)}
  </ul>;
  return (
    <ul aria-label={ar ? 'الفواتح' : 'Openings'} className="flex flex-col gap-4">
      {openings.map(opening => {
        const inside = pieces.filter(piece => piece.opening.id === opening.id && piece.opening.partition === opening.partition);
        if (!inside.length) return null;
        return <li key={`${opening.id}:${opening.partition ?? ''}`} className="rounded-sm border border-[var(--home-rule)] px-3 py-3">
          <h2 className="text-xl font-arabic leading-loose">{opening.text}</h2>
          <p className={NOTE}>{ar ? `${ayatCount(opening.count)} · ${counted(inside.length, ['مجموعة', 'مجموعتان', 'مجموعات'])} في هذه الصفحة` : `${opening.count} ayat · ${inside.length} entries on this page`}</p>
          <Link href={branchesHref(opening.id, juz ?? undefined, { ...props.view, spelling: undefined, partition: opening.partition })} className="text-sm text-[var(--home-accent)] hover:underline">{ar ? 'الشجرة كاملة' : 'Complete tree'}</Link>
          <ul className="flex flex-col gap-4 mt-3">{inside.map((piece, index) => <Entry key={`${piece.id}:${index}`} piece={piece} partOf={false} juz={juz} {...props} />)}</ul>
        </li>;
      })}
    </ul>
  );
}
