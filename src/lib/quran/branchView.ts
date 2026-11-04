export const BRANCH_VIEW_COOKIE = 'branches-view';
export type BranchView = 'tree' | 'cards';
export const parseBranchView = (value: string | null | undefined): BranchView | undefined => value === 'tree' || value === 'cards' ? value : undefined;
