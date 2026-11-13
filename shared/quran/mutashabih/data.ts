import artifact from '../../data/quran/mutashabih.json';
import type { Group } from './types';
import { canonicalGroups } from './identity';
import { categorizedGroups } from './categories';

export const groups: Group[] = canonicalGroups(categorizedGroups(artifact as unknown as Group[]));
