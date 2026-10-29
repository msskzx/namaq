'use client';

import React from 'react';
import { useLanguage } from '@/components/language/LanguageContext';
import { ayatCount } from '@/lib/quran/arabicNumber';
import { branch, variants, type BranchAyah, type BranchesView, type Piece } from '@/lib/quran/branches';
import type { JuzRange } from '@/lib/quran/juz';
import BranchTree from './BranchTree';
import { phrasePresentation, type PhraseGroup } from '@/lib/quran/phraseTrees';

export type SharedPiece = Piece & { phrase?: PhraseGroup };
const NOTE = 'text-sm text-[var(--home-muted)]';

export const PER_PAGE = 10;

type Props = { names: Record<number, string>; ayat: Map<string, BranchAyah>; juz: JuzRange | null; view?: BranchesView };


function Entry({ piece, names, ayat, juz, view }: Props & { piece: SharedPiece }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  const group = piece.keys.map(key => ayat.get(key)!);
  const presentation = piece.phrase ? phrasePresentation(piece.phrase, group, false, false) : undefined;
  return (
    <li>
      <BranchTree
        header={<p className={NOTE}>
          {piece.family && <>{ar ? piece.opening.text : piece.opening.textEn} · </>}
          {ar ? ayatCount(piece.count) : `${piece.count} ayat`}
        </p>}
        tree={presentation?.tree ?? branch(group, piece.family)} variants={presentation ? [] : piece.family ? [] : variants(group)} prefixes={presentation?.prefixes} offsets={presentation?.offsets} names={names}
        juz={juz} view={view} surround={{ on: false }} label={ar ? 'شجرة العبارات المشتركة' : 'Shared phrase tree'}
      />
    </li>
  );
}

export default function PieceList({ pieces, juz, ...props }: Props & { pieces: SharedPiece[] }) {
  const { language } = useLanguage();
  const ar = language === 'ar';
  if (!pieces.length) return <p role="status" className={NOTE}>{ar ? 'لا أشجار مشتركة داخل هذه الأجزاء.' : 'No shared trees in this juz range.'}</p>;
  return <ul aria-label={ar ? 'المتشابهات' : 'Shared trees'} className="flex flex-col gap-4">
    {pieces.map(piece => <Entry key={piece.id} piece={piece} juz={juz} {...props} />)}
  </ul>;
}
