'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import { GalleryHorizontal } from 'lucide-react';
import Button from '@/components/common/Button';
import TreeIcon from '@/components/common/TreeIcon';
import { BRANCH_VIEW_COOKIE, defaultBranchView, showsOtherView, type BranchView } from '@shared/quran/branchView';
import type { TreePreview } from '@/app/quran/read/ayahPreview';
import BranchTree from './BranchTree';
import AyahCards from './AyahCards';
import { CardActions, DoubleTapSave } from './Filters';
import PathAyat, { passageOf } from './PathAyat';
import { PathScope } from './Paths';
import SurahChips from './SurahChips';
import { AroundButton, RotateButton } from './Surroundings';

/**
 * One tree as the branches page draws it, as the app's home card embeds the branches tab's own card (owner, 2026-11-14): zoom,
 * pan, a path lit on a click and read in full under the buttons, a double click to save, and the card's own buttons (save,
 * tree or matrix, rotate, the surrounding ayat, share). It opens in the view chosen in the settings (the branches page's cookie),
 * and its switches change only this card. The home feed and the reader's trees sheet use it.
 * `mixed`: for a reader who picked the tree, one tree in ten opens as the matrix, as the home feed does.
 */
/** `frameClassName` draws the tree in a card of its own (home's posts); the matrix is a card already, so it goes without. */
export default function TreeViewCard({ tree, height, names, mixed = false, actionsClassName, frameClassName, start }: {
  tree: TreePreview; height: string; names: Record<number, string>; mixed?: boolean; actionsClassName?: string; frameClassName?: string; start?: BranchView;
}) {
  const [chosen, setView] = useState<BranchView>(() => {
    if (start) return start;
    const pref = defaultBranchView(Cookies.get(BRANCH_VIEW_COOKIE));
    return mixed && pref === 'tree' && showsOtherView(tree.id) ? 'cards' : pref;
  });
  const view: BranchView = tree.matrixOnly ? 'cards' : chosen;
  const viewLabel = view === 'tree' ? 'عرض المصفوفة' : 'عرض الشجرة';
  const rows = tree.ayat?.map(ayah => ayah.key) ?? [];
  const passages = tree.ayat?.map(passageOf) ?? [];
  return <PathScope><div data-share-card>
    <div data-share-image className={view === 'tree' && frameClassName ? frameClassName : 'px-2'}>
      <DoubleTapSave id={tree.id} text={tree.text}>
        {view === 'cards'
          ? <AyahCards card={tree.id} ayahKeys={rows} passageKeys={passages} names={names} />
          : <BranchTree tree={tree.tree} ayat={tree.ayat} prefixes={tree.prefixes} offsets={tree.offsets} names={names} surround={{ on: false, sync: true, card: tree.id }} viewportHeight={height} direction="auto" rotatable zoomInRail />}
      </DoubleTapSave>
    </div>
    <div className={actionsClassName ?? 'px-2 py-1'}>
      <CardActions id={tree.id} text={tree.text} href={tree.href} toggles={<>
        {!tree.matrixOnly && <Button size="lg" variant="muted" onClick={() => setView(view === 'tree' ? 'cards' : 'tree')} aria-label={viewLabel} title={viewLabel}>{view === 'tree' ? <GalleryHorizontal aria-hidden /> : <TreeIcon aria-hidden />}</Button>}
        <AroundButton card={tree.id} />
        {view === 'tree' && <RotateButton card={tree.id} />}
      </>} />
    </div>
    <div className="flex flex-col gap-2 px-2">
      <SurahChips ayahKeys={rows} names={names} interactive={view === 'tree'} />
      {view === 'tree' && <PathAyat rows={rows} passages={passages} card={tree.id} names={names} />}
    </div>
  </div></PathScope>;
}
