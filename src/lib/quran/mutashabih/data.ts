import artifact from '@/app/quran/branches/mutashabih.json';
import type { Group } from './types';

export const groups: Group[] = JSON.parse(JSON.stringify(artifact));
