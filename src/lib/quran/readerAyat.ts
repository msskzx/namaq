import type { BranchAyah } from '@shared/quran/branches';
import treeData from '@shared/data/quran/trees.json';

export const loadReaderAyat = async (): Promise<BranchAyah[]> => treeData.ayat;
