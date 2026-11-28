export const BRANCH_VIEW_COOKIE = 'branches-view';
export const BRANCH_CONNECTORS_COOKIE = 'branches-connectors';
export type BranchView = 'tree' | 'cards';
export const parseBranchView = (value: string | null | undefined): BranchView | undefined => value === 'tree' || value === 'cards' ? value : undefined;
export const defaultBranchView = (setting: string | null | undefined): BranchView => parseBranchView(setting) ?? 'cards';

export function showsOtherView(id: string): boolean {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return hash % 10 === 0;
}
