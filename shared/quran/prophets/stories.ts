import { ALYASA } from './alyasa';
import { AYYUB } from './ayyub';
import { DHUL_KIFL } from './dhul-kifl';
import { HARUN } from './harun';
import { IDRIS } from './idris';
import { ILYAS } from './ilyas';
import { MUSA } from './musa';
import { NUH } from './nuh';
import { SHUAYB } from './shuayb';
import type { Story } from './story';

export const STORIES: Record<string, Story> = { idris: IDRIS, nuh: NUH, ayyub: AYYUB, shuayb: SHUAYB, musa: MUSA, harun: HARUN, 'dhul-kifl': DHUL_KIFL, ilyas: ILYAS, alyasa: ALYASA };
