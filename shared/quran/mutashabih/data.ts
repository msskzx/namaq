import artifact from '../../data/quran/mutashabih.json';
import type { Group } from './types';
import { canonicalGroups } from './identity';
import { categorizedGroups } from './categories';

export const groups: Group[] = canonicalGroups(categorizedGroups(JSON.parse(JSON.stringify(artifact))));
