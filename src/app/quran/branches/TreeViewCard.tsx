'use client';

import { useState, useSyncExternalStore } from 'react';
import Cookies from 'js-cookie';
import { Bookmark, GalleryHorizontal } from 'lucide-react';
import Button from '@/components/common/Button';
import TreeIcon from '@/components/common/TreeIcon';
import { readBookmarks, serverBookmarks, subscribeBookmarks, toggleBookmark } from '@shared/bookmarks';
import { BRANCH_VIEW_COOKIE, parseBranchView, showsOtherView, type BranchView } from '@shared/quran/branchView';
import type { TreePreview } from '@/app/quran/read/ayahPreview';
import BranchTree from './BranchTree';
import AyahCards from './AyahCards';

/**
 * One tree as the branches page draws it (zoom, pan, a path lit on a click), with its own save and tree/matrix switch,
 * opening in the view chosen in the settings (the branches page's cookie). The home feed and the reader's trees sheet use it.
 * `mixed`: one tree in ten opens the other view, as the home feed does.
 */
export default function TreeViewCard({ tree, height, names, mixed = false, actionsClassName }: {
  tree: TreePreview; height: string; names: Record<number, string>; mixed?: boolean; actionsClassName?: string;
}) {
  const bookmarks = useSyncExternalStore(subscribeBookmarks, readBookmarks, serverBookmarks);
  const saved = bookmarks.some(item => item.id === tree.id);
  const [view, setView] = useState<BranchView>(() => {
    const pref = parseBranchView(Cookies.get(BRANCH_VIEW_COOKIE)) ?? 'tree';
    return mixed && showsOtherView(tree.id) ? (pref === 'tree' ? 'cards' : 'tree') : pref;
  });
  const viewLabel = view === 'tree' ? 'عرض المصفوفة' : 'عرض الشجرة';
  return <>
    <div className="px-2">
      {view === 'cards'
        ? <AyahCards ayahKeys={tree.ayat?.map(ayah => ayah.key) ?? []} names={names} />
        : <BranchTree tree={tree.tree} ayat={tree.ayat} prefixes={tree.prefixes} offsets={tree.offsets} names={names} surround={{ on: false, sync: true }} viewportHeight={height} direction="auto" zoomInRail />}
    </div>
    <div className={actionsClassName ?? 'flex items-center gap-1 px-2 py-1'} data-share-skip>
      <Button size="lg" variant="muted" aria-pressed={saved} aria-label={saved ? 'أزلها من المحفوظات' : 'احفظ'} title={saved ? 'أزلها من المحفوظات' : 'احفظ'} className={saved ? 'text-[var(--home-accent)]' : undefined}
        onClick={() => toggleBookmark({ id: tree.id, text: tree.text, href: tree.href })}><Bookmark aria-hidden fill={saved ? 'currentColor' : 'none'} /></Button>
      <Button size="lg" variant="muted" onClick={() => setView(view === 'tree' ? 'cards' : 'tree')} aria-label={viewLabel} title={viewLabel}>{view === 'tree' ? <GalleryHorizontal aria-hidden /> : <TreeIcon aria-hidden />}</Button>
    </div>
  </>;
}
