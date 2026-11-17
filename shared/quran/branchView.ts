export const BRANCH_VIEW_COOKIE = 'branches-view';
export const BRANCH_CONNECTORS_COOKIE = 'branches-connectors';
export type BranchView = 'tree' | 'cards';
export const parseBranchView = (value: string | null | undefined): BranchView | undefined => value === 'tree' || value === 'cards' ? value : undefined;
/** The view a tree opens in: the matrix, unless the reader picked the tree in settings (owner, 2026-11-17: the tree was the default and friends opening a shared link found it buggy). */
export const defaultBranchView = (setting: string | null | undefined): BranchView => parseBranchView(setting) ?? 'cards';

/**
 * Home feed trees (owner, 2026-11-14): one tree in ten opens in the other view than the reader's default, so both views are seen;
 * since 2026-11-17 only readers who picked the tree get this (they see one in ten as the matrix), so nobody is shown a tree unasked.
 * Picked by the tree's id, so a tree always opens the same way.
 */
export function showsOtherView(id: string): boolean {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return hash % 10 === 0;
}
