'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/language/LanguageContext';
import { ayatCount, counted, num } from '@/lib/quran/arabicNumber';
import { branch, branchesHref, variants, type BranchAyah, type BranchesView, type Opening, type Piece } from '@/lib/quran/branches';
import type { JuzRange } from '@/lib/quran/juz';
import BranchTree from './BranchTree';
import Badge from '@/components/common/Badge';
import { phrasePresentation, type PhraseGroup } from '@/lib/quran/phraseTrees';

export type SharedPiece = Piece & { phrase?: PhraseGroup };
const NOTE = 'text-sm text-[var(--home-muted)]';

export const PER_PAGE = 10;

type Props = { names: Record<number, string>; ayat: Map<string, BranchAyah>; juz: JuzRange | null; view?: BranchesView };


function Entry({ piece, names, ayat, juz, partOf, view }: Props & { piece: SharedPiece; partOf: boolean }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const group = piece.keys.map(key => ayat.get(key)!);
  const presentation = piece.phrase ? phrasePresentation(piece.phrase, group) : undefined;
  const ownView = piece.phrase ? { ...view, kind: 'inside' as const, phraseId: piece.phrase.id } : { ...view, kind: undefined };
  return (
    <li>
      <BranchTree
        header={<p className={NOTE}>
          {(view?.scope === 'all' || view?.scope === 'inside') && <><Badge size="sm" text={piece.phrase ? (ar ? 'داخل الآية' : 'Inside ayah') : (ar ? 'أول الآية' : 'Ayah opening')} />{' · '}</>}
          {piece.family && <>{ar ? piece.opening.text : piece.opening.textEn} · </>}
          {ar ? ayatCount(piece.count) : `${piece.count} ayat`}
          {partOf && piece.opening.count > piece.count && <>
            {ar ? ' · من: ' : ' · From: '}
            <Link href={branchesHref(piece.opening.id, juz ?? undefined, { ...view, spelling: undefined, partition: piece.opening.partition, kind: piece.phrase ? 'inside' : undefined })} className="font-arabic text-[var(--home-accent)] hover:underline">
              {`${piece.opening.text} (${ar ? num(piece.opening.count) : piece.opening.count})`}
            </Link>
          </>}
        </p>}
        tree={presentation?.tree ?? branch(group, piece.family)} variants={presentation ? [] : piece.family ? [] : variants(group)} prefixes={presentation?.prefixes} offsets={presentation?.offsets} names={names}
        juz={juz} view={ownView} surround={{ on: false }}
      />
    </li>
  );
}

export default function PieceList({ pieces, openings, juz, ...props }: Props & { pieces: SharedPiece[]; openings?: (Opening & { kind?: 'inside' })[] }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  if (!pieces.length) return <p role="status" className={NOTE}>{ar ? 'لا أشجار مشتركة داخل هذه الأجزاء.' : 'No shared trees in this juz range.'}</p>;
  if (!openings) return <ul aria-label={ar ? 'المتشابهات' : 'Shared entries'} className="flex flex-col gap-4">
    {pieces.map((piece, index) => <Entry key={`${piece.id}:${index}`} piece={piece} partOf juz={juz} {...props} />)}
  </ul>;
  return (
    <ul aria-label={ar ? 'الفواتح' : 'Openings'} className="flex flex-col gap-4">
      {openings.map(opening => {
        const inside = pieces.filter(piece => piece.opening.id === opening.id && piece.opening.partition === opening.partition && Boolean(piece.phrase) === (opening.kind === 'inside'));
        if (!inside.length) return null;
        return <li key={`${opening.kind ?? 'opening'}:${opening.id}:${opening.partition ?? ''}`} className="rounded-sm border border-[var(--home-rule)] px-3 py-3">
          <h2 className="text-xl font-arabic leading-loose">{ar ? opening.text : opening.textEn ?? opening.text}</h2>
          <p className={NOTE}>{ar ? `${ayatCount(opening.count)} · ${counted(inside.length, ['مجموعة', 'مجموعتان', 'مجموعات'])} في هذه الصفحة` : `${opening.count} ayat · ${inside.length} entries on this page`}</p>
          <Link href={branchesHref(opening.id, juz ?? undefined, { ...props.view, spelling: undefined, partition: opening.partition, kind: opening.kind })} className="text-sm text-[var(--home-accent)] hover:underline">{ar ? 'الشجرة كاملة' : 'Complete tree'}</Link>
          <ul className="flex flex-col gap-4 mt-3">{inside.map((piece, index) => <Entry key={`${piece.id}:${index}`} piece={piece} partOf={false} juz={juz} {...props} />)}</ul>
        </li>;
      })}
    </ul>
  );
}
