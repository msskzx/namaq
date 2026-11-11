import { IDRIS } from './idris';
import { MUSA } from './musa';
import { NUH } from './nuh';
import type { Story } from './story';

export const STORIES: Record<string, Story> = { musa: MUSA, nuh: NUH, idris: IDRIS };
